# EPM Gas Balances - Backend API

API REST para gestión de balances virtuales de gas natural.

## Instalación

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
.\venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
```

## Ejecución

```bash
# Modo desarrollo
uvicorn app.main:app --reload --port 8000

# Modo producción
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Documentación

Una vez iniciado el servidor, acceder a:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Estructura

```
backend/
├── app/
│   ├── main.py              # Entry point
│   ├── config.py            # Configuración
│   ├── api/
│   │   └── routes/          # Endpoints
│   ├── services/            # Lógica de negocio
│   └── schemas/             # Modelos Pydantic
└── requirements.txt
```
