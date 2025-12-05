"""Configuración de la aplicación"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

class Settings:
    """Configuración global de la API"""
    
    # API Config
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    API_RELOAD: bool = os.getenv("API_RELOAD", "true").lower() == "true"
    
    # Project Info
    PROJECT_NAME: str = "EPM Gas Balances API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "API para predicción de balances virtuales de gas natural"
    
    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    ALLOWED_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]
    
    # Rutas de datos
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    DATA_PATH: Path = BASE_DIR.parent / "BALANC-IA"
    
    # Validar que la carpeta de datos existe
    @classmethod
    def validate_data_path(cls):
        """Valida que la carpeta BALANC-IA existe"""
        if not cls.DATA_PATH.exists():
            raise FileNotFoundError(
                f"La carpeta de datos no existe: {cls.DATA_PATH}\n"
                f"Asegúrate de que BALANC-IA esté en la raíz del proyecto."
            )
        return True

# Instancia de configuración
settings = Settings()
