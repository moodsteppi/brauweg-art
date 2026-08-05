# 3D-Avatar (Pinguin)

## Fertige Dateien

| Datei | Bedeutung |
|---|---|
| `penguin_base.glb` | Nackter Pinguin, Höhe ≈ 1 m, Füße auf Y = 0 |
| `beanie.glb` | Lila Mütze, auf Kopfbreite skaliert (~0.55×), Ursprung am Krempe-Boden |
| `avatar_normalize.json` | Messwerte + Vorschlag für `head_socket` / `beanie_default` |

Originale bleiben unberührt:

- `cute penguin 3d model.glb`
- `assets/purple knitted beanie 3d model.glb`

## Konvention

- **Pinguin:** Ursprung zwischen den Füßen, Y nach oben.
- **Mütze:** Ursprung = Unterkante Mitte (Auflage auf dem Kopf).
- **Anbau:** Mütze als Kind des Pinguins; lokale Transform ≈ `beanie_default` in `avatar_normalize.json`, Feinschliff später im R3F-Panel.

Beim ersten Durchlauf war die Mütze fast so groß wie der ganze Pinguin. Skalierung jetzt ≈ **0.55**, Krempe ≈ Kopfbreite × 1.08.

## Neu normalisieren

```bash
cd brauweg-art/3d
.venv/bin/python normalize_avatar.py
```

(Blender war hier nicht installiert — die Normalisierung läuft über Node-Transforms in der GLB, Texturen bleiben erhalten.)

## Im Browser ausrichten

Client-Dev-Server starten, dann:

```
http://localhost:5173/?dev=avatar
```

GLBs liegen auch unter `Brauweg-spielen/brauweg/packages/client/public/3d/`.
Übergabe-Text für Anni: `brauweg/docs/UEBERGABE-ANNI.md`.
