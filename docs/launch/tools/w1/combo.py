# One review sheet per route: 1440 strips then 390 strips, same height.
import sys, math
from PIL import Image, ImageDraw
def strips(path, colw, H):
    im = Image.open(path).convert('RGB'); W = im.size[0]; sc = colw / W; sh = int(H / sc); out = []
    for i in range(math.ceil(im.size[1] / sh)):
        c = im.crop((0, i * sh, W, min(im.size[1], (i + 1) * sh))); out.append(c.resize((colw, max(1, int(c.size[1] * sc)))))
    return out
root, slug, out = sys.argv[1], sys.argv[2], sys.argv[3]
H = int(sys.argv[4]) if len(sys.argv) > 4 else 1300
parts = strips(f'{root}/full/{slug}__1440.jpg', 400, H) + [None] + strips(f'{root}/full/{slug}__390.jpg', 230, H)
Wt = sum((p.size[0] if p else 20) + 6 for p in parts)
sheet = Image.new('RGB', (Wt, H), (255, 255, 255)); x = 0
for p in parts:
    if p is None: x += 26; continue
    sheet.paste(p, (x, 0)); x += p.size[0] + 6
sheet.save(out, quality=70); print(out, sheet.size)
