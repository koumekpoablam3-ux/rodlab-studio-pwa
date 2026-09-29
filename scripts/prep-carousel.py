"""
Prépare les 3 images fournies par le client pour le carrousel de fond de l'accueil.
- Conversion PNG → JPEG optimisé (1600 px de large max, qualité 80, progressif)
"""
from PIL import Image
import os

SRC = '/home/z/my-project/upload'
DST = '/home/z/my-project/public/images/site'

FILES = [
    ('image (2).png', 'carousel-formation.jpg'),  # Session de formation RodLab
    ('image (3).png', 'carousel-agence.jpg'),     # Bureau « Des idées aujourd'hui »
    ('image (4).png', 'carousel-bureau.jpg'),     # Bureau « De grandes idées »
]

for src_name, dst_name in FILES:
    im = Image.open(os.path.join(SRC, src_name)).convert('RGB')
    w, h = im.size
    if w > 1600:
        im = im.resize((1600, round(h * 1600 / w)), Image.LANCZOS)
    out = os.path.join(DST, dst_name)
    im.save(out, 'JPEG', quality=80, optimize=True, progressive=True)
    print(f'{dst_name}: {im.size}, {os.path.getsize(out)/1024:.0f} Ko')
