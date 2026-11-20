import argparse, os
from PIL import Image, ImageOps
p=argparse.ArgumentParser()
p.add_argument('--icono',required=True); p.add_argument('--splash',required=True)
a=p.parse_args()
project=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
res=os.path.join(project,'app','src','main','res')
icon=ImageOps.fit(Image.open(a.icono).convert('RGB'),(512,512),method=Image.Resampling.LANCZOS)
for folder,size in {'mipmap-mdpi':48,'mipmap-hdpi':72,'mipmap-xhdpi':96,'mipmap-xxhdpi':144,'mipmap-xxxhdpi':192}.items():
 d=os.path.join(res,folder); os.makedirs(d,exist_ok=True)
 icon.resize((size,size),Image.Resampling.LANCZOS).save(os.path.join(d,'ic_launcher.png'))
splash=Image.open(a.splash).convert('RGB')
canvas=Image.new('RGB',(1080,1920),(5,5,5))
fit=ImageOps.contain(splash,(1080,1920),method=Image.Resampling.LANCZOS)
canvas.paste(fit,((1080-fit.width)//2,(1920-fit.height)//2))
d=os.path.join(res,'drawable-nodpi'); os.makedirs(d,exist_ok=True)
canvas.save(os.path.join(d,'percia_splash.png'),optimize=True)
print('Imágenes aplicadas al proyecto. Ahora compila el APK.')
