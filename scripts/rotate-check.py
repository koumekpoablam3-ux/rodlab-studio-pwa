from PIL import Image

src = '/home/z/my-project/upload/pasted_image_1789330235700.png'
im = Image.open(src)
# Rotate 90° clockwise and 90° counter-clockwise for visual inspection
im.transpose(Image.ROTATE_270).save('/home/z/my-project/scripts/rot_cw.png')   # 90° CW
im.transpose(Image.ROTATE_90).save('/home/z/my-project/scripts/rot_ccw.png')   # 90° CCW
print('cw', im.transpose(Image.ROTATE_270).size, 'ccw', im.transpose(Image.ROTATE_90).size)
