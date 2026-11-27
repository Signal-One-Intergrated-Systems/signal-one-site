# Before | after contact sheet for one route and width: each full page cut into strips, before strips on top row, after below.
import sys, math
from PIL import Image, ImageDraw
b, a, out = sys.argv[1], sys.argv[2], sys.argv[3]
colw = int(sys.argv[4]) if len(sys.argv) > 4 else 300
rowh = int(sys.argv[5]) if len(sys.argv) > 5 else 640
ims = [Image.open(p).convert('RGB') for p in (b, a)]
W = ims[0].size[0]; scale = colw / W; striph = int(rowh / scale)
n = max(math.ceil(im.size[1] / striph) for im in ims)
sheet = Image.new('RGB', (n * (colw + 6), 2 * rowh + 30), (255, 255, 255)); d = ImageDraw.Draw(sheet)
for r, im in enumerate(ims):
    for i in range(math.ceil(im.size[1] / striph)):
        c = im.crop((0, i * striph, W, min(im.size[1], (i + 1) * striph)))
        c = c.resize((colw, max(1, int(c.size[1] * scale))))
        sheet.paste(c, (i * (colw + 6), r * (rowh + 30) + 14))
    d.text((4, r * (rowh + 30)), ('BEFORE ' if r == 0 else 'AFTER ') + f'{im.size[1]}px', fill=(200, 0, 0))
sheet.save(out, quality=72); print(out, sheet.size)
