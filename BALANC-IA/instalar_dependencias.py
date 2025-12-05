"""
Script para instalar dependencias necesarias para el modelo mejorado
"""
import subprocess
import sys

dependencias = [
    'pandas',
    'numpy',
    'prophet',
    'lightgbm',
    'scikit-learn',
    'catboost',
    'tensorflow'  # Opcional para LSTM
]

print("=" * 80)
print("INSTALACIÓN DE DEPENDENCIAS PARA MODELO MEJORADO")
print("=" * 80)

for dep in dependencias:
    print(f"\nInstalando {dep}...")
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', dep, '-q'])
        print(f"✓ {dep} instalado correctamente")
    except subprocess.CalledProcessError:
        print(f"⚠ Error instalando {dep} (puede que ya esté instalado o requiera configuración adicional)")

print("\n" + "=" * 80)
print("INSTALACIÓN COMPLETADA")
print("=" * 80)
print("\nNota: TensorFlow es opcional. Si no se instala, el modelo híbrido Prophet+LSTM")
print("no estará disponible, pero los demás modelos funcionarán correctamente.")

