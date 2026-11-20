ANTES DE COMPILAR:
1) Sube aquí tus imágenes elegidas desde tu celular:
   icono.png (cuadrada) e inicio.png (vertical).
2) En GitHub Actions, el workflow las aplicará automáticamente antes de compilar.
Si compilas fuera de GitHub Actions, ejecuta:
   pip install pillow
   python tools/personalizar_percia.py --icono personalizacion/icono.png --splash personalizacion/inicio.png
Luego compila. Cambiar imágenes exige generar un APK nuevo.
