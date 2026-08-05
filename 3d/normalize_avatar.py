#!/usr/bin/env python3
"""
Normalize penguin + beanie GLBs for the Brauweg avatar system.

Convention
----------
- Units: meters, penguin height ≈ 1.0
- Penguin origin: feet on Y=0, X/Z centered
- Beanie origin: bottom-center of the brim (contact with head), X/Z centered
- Beanie size: brim width ≈ head width at sit height × 1.08 (slightly oversized)

Does not remesh — only node scale/translation — so textures stay intact.

Usage:
  .venv/bin/python normalize_avatar.py
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path

import numpy as np
import trimesh
from pygltflib import GLTF2, Node

ROOT = Path(__file__).resolve().parent
SRC_PENG = ROOT / "cute penguin 3d model.glb"
SRC_HAT = ROOT / "assets" / "purple knitted beanie 3d model.glb"
OUT_PENG = ROOT / "penguin_base.glb"
OUT_HAT = ROOT / "beanie.glb"
OUT_META = ROOT / "avatar_normalize.json"

# Head band height (fraction of penguin height) used to measure sit width
SIT_T = 0.90
CROWN_T = 0.94
# Beanie slightly larger than the measured head
BRIM_OVERSIZE = 1.08


def load_mesh(path: Path) -> trimesh.Trimesh:
    scene = trimesh.load(str(path), force="scene")
    return scene.to_geometry()


def ensure_single_root(gltf: GLTF2) -> int:
    scene = gltf.scenes[gltf.scene]
    roots = list(scene.nodes or [])
    if len(roots) == 1:
        return roots[0]
    wrapper = Node(children=roots, name="AvatarRoot")
    gltf.nodes.append(wrapper)
    idx = len(gltf.nodes) - 1
    scene.nodes = [idx]
    return idx


def node_trs(node: Node):
    t = list(node.translation) if node.translation else [0.0, 0.0, 0.0]
    r = list(node.rotation) if node.rotation else [0.0, 0.0, 0.0, 1.0]
    s = list(node.scale) if node.scale else [1.0, 1.0, 1.0]
    return t, r, s


def main() -> None:
    if not SRC_PENG.exists():
        raise SystemExit(f"missing {SRC_PENG}")
    if not SRC_HAT.exists():
        raise SystemExit(f"missing {SRC_HAT}")

    peng = load_mesh(SRC_PENG)
    pv = peng.vertices
    p_ymin, p_ymax = float(pv[:, 1].min()), float(pv[:, 1].max())
    p_h = p_ymax - p_ymin

    y_sit = p_ymin + SIT_T * p_h
    band = pv[(pv[:, 1] > y_sit - 0.03 * p_h) & (pv[:, 1] < y_sit + 0.03 * p_h)]
    head_w = float((band.max(0) - band.min(0))[0]) if len(band) else 0.45

    crown = pv[pv[:, 1] >= p_ymin + CROWN_T * p_h]
    crown_ctr = (crown.min(0) + crown.max(0)) / 2
    head_socket = {
        "position": [
            float(crown_ctr[0]),
            float(crown[:, 1].max() - 0.01),
            float(crown_ctr[2]),
        ],
        "rotation": [0.0, 0.0, 0.0],
        "scale": [1.0, 1.0, 1.0],
    }

    hat = load_mesh(SRC_HAT)
    hat_w = float(hat.extents[0])
    target_brim = head_w * BRIM_OVERSIZE
    scale = target_brim / hat_w
    hat_ctr = (hat.bounds[0] + hat.bounds[1]) / 2

    print(f"penguin height={p_h:.4f}  head_w@{y_sit:.3f}={head_w:.4f}")
    print(f"beanie width={hat_w:.4f}  scale={scale:.4f}  target_brim={target_brim:.4f}")
    print(f"head_socket={head_socket['position']}")

    # --- penguin_base: copy + rename root ---
    shutil.copy2(SRC_PENG, OUT_PENG)
    gltf_p = GLTF2().load(str(OUT_PENG))
    root_p = ensure_single_root(gltf_p)
    gltf_p.nodes[root_p].name = "PenguinBase"
    gltf_p.save(str(OUT_PENG))

    # --- beanie: scale + center XZ; keep brim bottom at Y=0 ---
    shutil.copy2(SRC_HAT, OUT_HAT)
    gltf_h = GLTF2().load(str(OUT_HAT))
    root_h = ensure_single_root(gltf_h)
    node = gltf_h.nodes[root_h]
    node.name = "Beanie"

    if node.matrix:
        # Insert a parent that applies uniform scale + XZ centering
        parent = Node(
            name="BeanieScaled",
            children=[root_h],
            scale=[scale, scale, scale],
            translation=[-float(hat_ctr[0]) * scale, 0.0, -float(hat_ctr[2]) * scale],
        )
        gltf_h.nodes.append(parent)
        gltf_h.scenes[gltf_h.scene].nodes = [len(gltf_h.nodes) - 1]
    else:
        t, _r, s = node_trs(node)
        node.scale = [s[0] * scale, s[1] * scale, s[2] * scale]
        node.translation = [
            -float(hat_ctr[0]) * scale,
            float(t[1]),
            -float(hat_ctr[2]) * scale,
        ]

    gltf_h.save(str(OUT_HAT))

    vp = load_mesh(OUT_PENG)
    vh = load_mesh(OUT_HAT)
    print("\n=== OUTPUT ===")
    print("penguin_base extents", np.round(vp.extents, 4), "ymin", round(float(vp.bounds[0][1]), 4))
    print(
        "beanie extents",
        np.round(vh.extents, 4),
        "ymin",
        round(float(vh.bounds[0][1]), 4),
        "width",
        round(float(vh.extents[0]), 4),
    )

    meta = {
        "convention": {
            "units": "meters (penguin height ≈ 1.0)",
            "penguin_origin": "feet on Y=0, X/Z centered",
            "beanie_origin": "bottom-center of brim (hat contact), X/Z centered",
            "attach": (
                "Parent beanie under penguin; set local transform to beanie_default "
                "(fine-tune later in the R3F levelling panel)."
            ),
        },
        "source": {
            "penguin": SRC_PENG.name,
            "beanie": str(SRC_HAT.relative_to(ROOT)),
        },
        "output": {"penguin_base": OUT_PENG.name, "beanie": OUT_HAT.name},
        "measures": {
            "penguin_height": p_h,
            "head_width_at_sit": head_w,
            "beanie_source_width": hat_w,
            "beanie_scale_applied": scale,
            "beanie_target_brim_width": target_brim,
        },
        "head_socket": head_socket,
        "beanie_default": {
            "position": head_socket["position"],
            "rotation": [0.0, 0.0, 0.0],
            "scale": [1.0, 1.0, 1.0],
        },
    }
    OUT_META.write_text(json.dumps(meta, indent=2) + "\n")
    print("wrote", OUT_META.name)
    print("wrote", OUT_PENG.name, OUT_PENG.stat().st_size)
    print("wrote", OUT_HAT.name, OUT_HAT.stat().st_size)


if __name__ == "__main__":
    main()
