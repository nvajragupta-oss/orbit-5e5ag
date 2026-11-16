"""Draw the app icons (PNG + SVG) — a yellow star and a ringed planet on a night sky.

Run from the project folder:   python3 tools/make_icons.py
Needs Pillow:                   python3 -m pip install pillow
"""

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "icons"
BG = (11, 16, 51)
YELLOW = (255, 210, 63)
PINK = (255, 107, 154)
CYAN = (61, 220, 255)
SS = 4  # supersampling for smooth edges


def star_points(cx, cy, r_out, r_in, n=5, rot=-90):
    pts = []
    for i in range(n * 2):
        r = r_out if i % 2 == 0 else r_in
        a = math.radians(rot + i * 180 / n)
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def draw(size):
    S = size * SS
    img = Image.new("RGB", (S, S), BG)
    d = ImageDraw.Draw(img)
    rnd = random.Random(7)
    for _ in range(26):  # little background stars
        x, y, r = rnd.random() * S, rnd.random() * S, S * rnd.choice([0.006, 0.009, 0.012])
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255))
    # planet with ring (top right)
    px, py, pr = S * 0.70, S * 0.32, S * 0.13
    d.ellipse([px - pr * 1.9, py - pr * 0.55, px + pr * 1.9, py + pr * 0.55], outline=CYAN, width=int(S * 0.022))
    d.ellipse([px - pr, py - pr, px + pr, py + pr], fill=PINK)
    d.arc([px - pr * 1.9, py - pr * 0.55, px + pr * 1.9, py + pr * 0.55], 0, 180, fill=CYAN, width=int(S * 0.022))
    # big star (kept inside the safe zone so "maskable" crops look fine)
    d.polygon(star_points(S * 0.42, S * 0.62, S * 0.25, S * 0.105), fill=YELLOW)
    return img.resize((size, size), Image.LANCZOS)


SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#0b1033"/>
  <ellipse cx="70" cy="32" rx="24.7" ry="7.2" fill="none" stroke="#3ddcff" stroke-width="2.2"/>
  <circle cx="70" cy="32" r="13" fill="#ff6b9a"/>
  <path d="M45.3 32 A24.7 7.2 0 0 0 94.7 32" fill="none" stroke="#3ddcff" stroke-width="2.2"/>
  <polygon fill="#ffd23f" points="{pts}"/>
</svg>
"""


def main():
    OUT.mkdir(exist_ok=True)
    for name, size in [("icon-192.png", 192), ("icon-512.png", 512), ("apple-touch-icon.png", 180)]:
        draw(size).save(OUT / name)
        print("wrote", OUT / name)
    pts = " ".join(f"{x:.1f},{y:.1f}" for x, y in star_points(42, 62, 25, 10.5))
    (OUT / "icon.svg").write_text(SVG.format(pts=pts))
    print("wrote", OUT / "icon.svg")


if __name__ == "__main__":
    main()
