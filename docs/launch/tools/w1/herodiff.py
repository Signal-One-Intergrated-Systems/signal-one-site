import sys
from PIL import Image, ImageChops
A, B = sys.argv[1], sys.argv[2]
for w in [1440, 1280, 1024, 768, 390]:
    a = Image.open(f'{A}/hero_{w}_0.png').convert('RGB'); b = Image.open(f'{B}/hero_{w}_0.png').convert('RGB')
    h = min(a.size[1], b.size[1])
    top = 90  # the header band is not part of the locked hero
    ca, cb = a.crop((0, top, w, h)), b.crop((0, top, w, h))
    d = ImageChops.difference(ca, cb).convert('L')
    px = sum(1 for v in d.getdata() if v > 24)
    print(w, 'sizes', a.size, b.size, 'diff bbox', d.getbbox(), 'pixels>24:', px, f'({100*px/(w*(h-top)):.3f}%)')
