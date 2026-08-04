#!/usr/bin/env python3
"""Baut alle 24 Vorderseiten eines Blattes.

Nutzt die Alpha-Maske der Rueckseite, grosse Eckenanzeigen und optionale
Bildkarten-Figuren aus art/_blattbau/faces/<deck>/.
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

W, H = 744, 1080
RANKS = {"9": "9", "10": "10", "b": "B", "d": "D", "k": "K", "a": "A"}
SUITS = ("kreuz", "pik", "herz", "karo")
VALUES = ("9", "10", "b", "d", "k", "a")
FACE = frozenset({"b", "d", "k"})
FONT = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"

# Deck-Themen: Pergament-Grund, Rahmenfarbe (RGBA), Rot-Ton
THEMES = {
    "eiche": {
        "bg": (246, 235, 214),
        "frame": [(168, 122, 58, 100), (120, 78, 32, 55)],
        "red": (200, 42, 38),
        "black": (28, 22, 18),
        "seed": 42,
    },
    "winterhof": {
        "bg": (232, 240, 248),
        "frame": [(170, 190, 210, 110), (120, 140, 160, 60)],
        "red": (210, 55, 55),
        "black": (28, 36, 48),
        "seed": 77,
    },
    "sommerwiese": {
        "bg": (250, 248, 230),
        "frame": [(140, 170, 70, 90), (100, 130, 50, 50)],
        "red": (205, 48, 42),
        "black": (30, 36, 24),
        "seed": 91,
    },
    "kupferstich": {
        "bg": (242, 232, 214),
        "frame": [(140, 90, 50, 100), (100, 60, 30, 55)],
        "red": (175, 45, 35),
        "black": (55, 35, 22),
        "seed": 11,
    },
    "schiefer": {
        "bg": (236, 238, 240),
        "frame": [(90, 95, 100, 80), (60, 65, 70, 45)],
        "red": (215, 70, 65),  # heller Rot gegen Grau
        "black": (40, 44, 48),
        "seed": 33,
    },
    "nachthimmel": {
        "bg": (228, 232, 245),
        "frame": [(200, 170, 80, 110), (140, 110, 40, 55)],
        "red": (220, 75, 70),  # heller Rot gegen Dunkel/Gold
        "black": (24, 28, 48),
        "seed": 55,
    },
    "rubin": {
        "bg": (248, 236, 232),
        "frame": [(180, 120, 60, 110), (120, 70, 30, 55)],
        "red": (190, 40, 50),
        "black": (40, 22, 28),
        "seed": 66,
    },
    "smaragd": {
        "bg": (236, 245, 236),
        "frame": [(180, 140, 60, 110), (120, 90, 30, 55)],
        "red": (200, 48, 42),
        "black": (22, 40, 28),
        "seed": 67,
    },
    "koeniglich": {
        "bg": (248, 240, 250),
        "frame": [(200, 160, 60, 120), (140, 100, 30, 60)],
        "red": (195, 40, 50),
        "black": (40, 24, 48),
        "seed": 88,
    },
    "pinguin": {
        "bg": (236, 244, 252),
        "frame": [(90, 150, 220, 110), (226, 182, 79, 90)],
        "red": (205, 50, 45),
        "black": (24, 32, 48),
        "seed": 99,
    },
}

ROOT = Path(__file__).resolve().parents[2] / "public" / "karten"
FACES_ROOT = Path(__file__).resolve().parent / "faces"


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT, size)


def suit_mask(size: int, suit: str) -> Image.Image:
    m = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(m)
    s = size
    cx, cy = s / 2, s / 2
    if suit == "herz":
        r = s * 0.22
        d.ellipse([cx - r * 1.55, cy - r * 1.35, cx - r * 0.05, cy + r * 0.35], fill=255)
        d.ellipse([cx + r * 0.05, cy - r * 1.35, cx + r * 1.55, cy + r * 0.35], fill=255)
        d.polygon([(cx - r * 1.72, cy - r * 0.15), (cx + r * 1.72, cy - r * 0.15), (cx, cy + r * 1.85)], fill=255)
    elif suit == "karo":
        d.polygon([(cx, cy - s * 0.42), (cx + s * 0.32, cy), (cx, cy + s * 0.42), (cx - s * 0.32, cy)], fill=255)
    elif suit == "pik":
        r = s * 0.23
        d.ellipse([cx - r * 1.55, cy - r * 0.95, cx - r * 0.05, cy + r * 0.75], fill=255)
        d.ellipse([cx + r * 0.05, cy - r * 0.95, cx + r * 1.55, cy + r * 0.75], fill=255)
        d.ellipse([cx - r * 0.95, cy - r * 1.85, cx + r * 0.95, cy + r * 0.15], fill=255)
        d.polygon(
            [(cx - s * 0.09, cy + r * 0.35), (cx + s * 0.09, cy + r * 0.35), (cx + s * 0.13, cy + s * 0.44), (cx - s * 0.13, cy + s * 0.44)],
            fill=255,
        )
        d.polygon([(cx - s * 0.06, cy + r * 0.5), (cx + s * 0.06, cy + r * 0.5), (cx, cy + s * 0.08)], fill=0)
    else:
        r = s * 0.20
        for ox, oy in ((0, -0.95), (-0.95, 0.15), (0.95, 0.15)):
            d.ellipse([cx + ox * r * 1.35 - r, cy + oy * r * 1.35 - r, cx + ox * r * 1.35 + r, cy + oy * r * 1.35 + r], fill=255)
        d.ellipse([cx - r * 0.85, cy - r * 0.55, cx + r * 0.85, cy + r * 1.15], fill=255)
        d.polygon(
            [(cx - s * 0.07, cy + r * 0.7), (cx + s * 0.07, cy + r * 0.7), (cx + s * 0.12, cy + s * 0.42), (cx - s * 0.12, cy + s * 0.42)],
            fill=255,
        )
    return m.filter(ImageFilter.GaussianBlur(0.35))


def tint(mask: Image.Image, color: tuple[int, int, int], highlight: bool = True) -> Image.Image:
    m = mask.convert("L")
    rgba = Image.composite(Image.new("RGBA", m.size, (*color, 255)), Image.new("RGBA", m.size, (0, 0, 0, 0)), m)
    if highlight:
        hx = Image.new("L", m.size, 0)
        hd = ImageDraw.Draw(hx)
        s = m.size[0]
        hd.ellipse([s * 0.18, s * 0.12, s * 0.55, s * 0.48], fill=120)
        hx = hx.filter(ImageFilter.GaussianBlur(max(1, int(s * 0.08))))
        hx = Image.composite(hx, Image.new("L", m.size, 0), m)
        white = Image.new("RGBA", m.size, (255, 255, 255, 0))
        white.putalpha(hx)
        rgba = Image.alpha_composite(rgba, white)
    return rgba


def parchment(theme: dict) -> Image.Image:
    rng = np.random.default_rng(theme["seed"])
    bg = theme["bg"]
    base = np.full((H, W, 3), bg, dtype=np.int16)
    noise = rng.integers(-7, 8, size=(H, W, 3))
    yy, xx = np.mgrid[0:H, 0:W]
    dist = np.sqrt(((xx - W / 2) / (W * 0.7)) ** 2 + ((yy - H / 2) / (H * 0.7)) ** 2)
    base = base + noise - (dist * 10)[:, :, None].astype(np.int16)
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), "RGB").convert("RGBA")
    d = ImageDraw.Draw(img)
    for i, col in enumerate(theme["frame"]):
        d.rounded_rectangle([32 + i * 5, 32 + i * 5, W - 32 - i * 5, H - 32 - i * 5], radius=52 - i * 3, outline=col, width=3)
    return img


def flood_near_bg(im: Image.Image, tol: int = 32) -> Image.Image:
    im = im.convert("RGBA")
    arr = np.array(im)
    h, w = arr.shape[:2]
    samples = [arr[2, 2, :3], arr[2, w - 3, :3], arr[h - 3, 2, :3], arr[h - 3, w - 3, :3]]
    bg = np.median(samples, axis=0)
    visited = np.zeros((h, w), dtype=bool)
    stack = []
    for x in range(w):
        stack.append((x, 0))
        stack.append((x, h - 1))
    for y in range(h):
        stack.append((0, y))
        stack.append((w - 1, y))
    while stack:
        x, y = stack.pop()
        if x < 0 or y < 0 or x >= w or y >= h or visited[y, x]:
            continue
        diff = np.abs(arr[y, x, :3].astype(float) - bg).sum()
        lum = arr[y, x, :3].astype(float).mean()
        if diff > tol and lum < 225:
            continue
        visited[y, x] = True
        arr[y, x, 3] = 0
        stack.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    return Image.fromarray(arr, "RGBA")


def corner_index(suit: str, value: str, color: tuple[int, int, int]) -> Image.Image:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    rank = RANKS[value]
    f = font(96 if value != "10" else 80)
    x, y = 40, 34
    for ox, oy in ((-2, 0), (2, 0), (0, -2), (0, 2), (2, 2), (-2, -2)):
        d.text((x + ox, y + oy), rank, font=f, fill=(255, 248, 235, 230))
    d.text((x, y), rank, font=f, fill=(*color, 255))
    bbox = d.textbbox((x, y), rank, font=f)
    sm = tint(suit_mask(84, suit), color, False)
    sx = x + max(0, (bbox[2] - bbox[0] - 84) // 2)
    sy = bbox[3] + 2
    layer.alpha_composite(sm, (sx, sy))
    return Image.alpha_composite(layer, layer.rotate(180))


def place_center(base: Image.Image, suit: str, color: tuple[int, int, int], scale: float = 1.0) -> None:
    size = int(360 * scale)
    sc = tint(suit_mask(size, suit), color, True)
    base.alpha_composite(sc, ((W - size) // 2, (H - size) // 2 + 8))


def pips(base: Image.Image, suit: str, value: str, color: tuple[int, int, int]) -> None:
    if value == "a":
        place_center(base, suit, color, 1.2)
        return
    if value == "9":
        place_center(base, suit, color, 0.92)
        sm = tint(suit_mask(72, suit), color, False)
        for p in [
            (155, 270),
            (W - 227, 270),
            (155, H - 342),
            (W - 227, H - 342),
            (W // 2 - 36, 210),
            (W // 2 - 36, H - 282),
            (155, H // 2 - 36),
            (W - 227, H // 2 - 36),
            (W // 2 - 36, H // 2 - 36),
        ]:
            base.alpha_composite(sm, p)
        return
    place_center(base, suit, color, 0.82)
    sm = tint(suit_mask(66, suit), color, False)
    for p in [
        (148, 245),
        (W - 214, 245),
        (148, H - 311),
        (W - 214, H - 311),
        (W // 2 - 33, 195),
        (W // 2 - 33, H - 261),
        (148, H // 2 - 90),
        (W - 214, H // 2 - 90),
        (148, H // 2 + 24),
        (W - 214, H // 2 + 24),
    ]:
        base.alpha_composite(sm, p)


def place_face(base: Image.Image, path: Path) -> None:
    art = flood_near_bg(Image.open(path), tol=32)
    bbox = art.split()[-1].getbbox()
    if bbox:
        art = art.crop(bbox)
    art.thumbnail((500, 700), Image.Resampling.LANCZOS)
    x = (W - art.width) // 2
    y = (H - art.height) // 2 + 24
    base.alpha_composite(art, (x, y))


def suit_color(theme: dict, suit: str) -> tuple[int, int, int]:
    return theme["red"] if suit in ("herz", "karo") else theme["black"]


def build_deck(deck: str) -> None:
    if deck not in THEMES:
        raise SystemExit(f"Unbekanntes Blatt: {deck}")
    theme = THEMES[deck]
    deck_dir = ROOT / deck
    faces = FACES_ROOT / deck
    mask = Image.open(deck_dir / "ruecken.png").convert("RGBA").split()[-1]
    if mask.size != (W, H):
        mask = mask.resize((W, H), Image.Resampling.LANCZOS)

    for suit in SUITS:
        for value in VALUES:
            color = suit_color(theme, suit)
            card = parchment(theme)
            face_path = faces / f"{suit}_{value}.png"
            if value in FACE and face_path.exists():
                place_face(card, face_path)
            else:
                pips(card, suit, value, color)
            card = Image.alpha_composite(card, corner_index(suit, value, color))
            r, g, b, a = card.split()
            card = Image.merge("RGBA", (r, g, b, ImageChops.darker(a, mask)))
            out = deck_dir / f"{suit}_{value}.png"
            card.save(out, "PNG")
            print(f"OK {deck}/{out.name}")
    print(f"Fertig: {deck} — 24 Karten")


if __name__ == "__main__":
    build_deck(sys.argv[1] if len(sys.argv) > 1 else "eiche")
