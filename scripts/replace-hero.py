"""
Remplace la photo du héros de l'accueil par l'image fournie par le client.
- Correction de l'orientation : rotation 90° anti-horaire (le fichier source était pivoté)
- Optimisation JPEG (qualité 86, progressif) pour le web / PWA
"""
from PIL import Image

SRC = '/home/z/my-project/upload/pasted_image_1789330235700.png'
DST = '/home/z/my-project/public/images/site/hero-agence.jpg'

im = Image.open(SRC).convert('RGB')
# ROTATE_90 = 90° anti-horaire → remet le flyer à l'endroit (vérifié visuellement)
fixed = im.transpose(Image.ROTATE_90)
print('Orientation corrigée :', fixed.size)  # attendu : 1024 x 1536 (portrait)

fixed.save(DST, 'JPEG', quality=86, optimize=True, progressive=True)

import os
print('Sauvegardé :', DST, f'{os.path.getsize(DST)/1024:.0f} Ko')
