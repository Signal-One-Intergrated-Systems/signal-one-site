import sys
from PIL import Image
src, out, chunk, scale = sys.argv[1], sys.argv[2], int(sys.argv[3]), float(sys.argv[4])
im = Image.open(src); W,H = im.size; n=0
for y in range(0,H,chunk):
    c = im.crop((0,y,W,min(H,y+chunk)))
    c = c.resize((int(c.width*scale), int(c.height*scale)))
    c.save(f"{out}-{n:02d}.png"); n+=1
print(n, W, H)
