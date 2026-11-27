"""Measure the darkest tone of every approved environment photograph used as a depth material.

Writes docs/launch/depth-scene-floor.json: for each scene, its SHA-256 and the 0.5th-percentile darkest
pixel (by relative luminance), which `scripts/check-design-system.mjs` uses as the worst case under the
veil and the frosted glass. The check refuses a scene whose file no longer matches the recorded hash, so
the measurement can never go stale silently. Run: python3 scripts/measure-scene-floor.py
"""
import hashlib, json, pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SCENES = [
    "public/images/bright/06-bright-architecture.webp",
    "public/images/backgrounds/restaurant-courtyard.webp",
    "public/images/backgrounds/restaurant-dining.webp",
    "public/images/backgrounds/small-control-room.webp",
    "public/images/backgrounds/business-park.webp",
    "public/images/backgrounds/warehouse-yard.webp",
]

def lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

out = {}
for rel in SCENES:
    path = ROOT / rel
    data = path.read_bytes()
    im = Image.open(path).convert("RGB")
    px = list(im.getdata())
    lum = sorted(px, key=lambda p: 0.2126 * lin(p[0]) + 0.7152 * lin(p[1]) + 0.0722 * lin(p[2]))
    r, g, b = lum[int(len(lum) * 0.005)]
    out["/" + rel.removeprefix("public/")] = {
        "sha256": hashlib.sha256(data).hexdigest(),
        "darkest": "#%02x%02x%02x" % (r, g, b),
        "size": list(im.size),
    }
(ROOT / "docs/launch/depth-scene-floor.json").write_text(json.dumps(out, indent=2) + "\n")
print(json.dumps(out, indent=2))
