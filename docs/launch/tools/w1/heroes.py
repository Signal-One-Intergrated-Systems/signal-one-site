# First viewport of every route side by side (cross-page hero comparison).
import sys, glob, os
from PIL import Image, ImageDraw
root, w, vh, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
tw = int(sys.argv[5]) if len(sys.argv) > 5 else 300
order = ['home','solutions_security','pricing','radios-equipment','ptt-radio-rental','equipment-marketplace','guard-patrol-software','guard-attendance-software','guard-marketplace','service','contact','get-started','guards','guards_join','join_sales','about','support','security-trust','popia','privacy','terms','this-page-does-not-exist-a2']
tiles = []
for s in order:
    p = f'{root}/full/{s}__{w}.jpg'
    if not os.path.exists(p): continue
    im = Image.open(p).convert('RGB'); im = im.crop((0, 0, w, min(vh, im.size[1]))); im = im.resize((tw, int(im.size[1] * tw / w)))
    d = ImageDraw.Draw(im); d.rectangle((0, 0, tw, 12), fill=(0, 0, 0)); d.text((3, 1), s, fill=(255, 255, 0)); tiles.append(im)
cols = 6 if w > 500 else 8; th = max(t.size[1] for t in tiles); rows = (len(tiles) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (tw + 4), rows * (th + 4)), 'white')
for i, t in enumerate(tiles): sheet.paste(t, ((i % cols) * (tw + 4), (i // cols) * (th + 4)))
sheet.save(out, quality=72); print(out, sheet.size)
