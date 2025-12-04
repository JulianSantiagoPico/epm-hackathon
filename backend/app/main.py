"""FastAPI Application - Entry Point"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.routes import dashboard, balances, models, correlations, alerts, reliability, benchmark, forecast

# Validar ruta de datos al inicio
settings.validate_data_path()

# Crear instancia de FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/", tags=["Health"])
def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": f"{settings.PROJECT_NAME} is running",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
def health_check():
    """Verificar estado de la API y acceso a datos"""
    from app.services.data_loader import data_loader
    
    try:
        valvulas = data_loader.get_available_valvulas()
        valvulas_count = len(valvulas)
    except Exception:
        valvulas_count = 0
    
    return {
        "status": "healthy",
        "data_path_exists": settings.DATA_PATH.exists(),
        "data_path": str(settings.DATA_PATH),
        "valvulas_disponibles": valvulas_count
    }

@app.get("/test/data-loader", tags=["Test"])
def test_data_loader():
    """Probar que el Data Loader puede leer todos los CSVs"""
    from app.services.data_loader import data_loader
    
    results = {}
    
    # Probar carga de cada CSV
    test_methods = [
        ("balances_virtuales", data_loader.load_balances_virtuales),
        ("pronosticos", data_loader.load_pronosticos),
        ("metrics", data_loader.load_metrics),
        ("resumen_valvulas", data_loader.load_resumen_valvulas),
        ("alertas", data_loader.load_alertas),
        ("top_desbalances", data_loader.load_top_desbalances),
        ("correlations", data_loader.load_correlations),
        ("analisis_confiabilidad", data_loader.load_analisis_confiabilidad),
        ("benchmark_historico", data_loader.load_benchmark_historico),
        ("resumen_pronostico_valvulas", data_loader.load_resumen_pronostico_valvulas),
        ("reporte_metricas_performance", data_loader.load_reporte_metricas_performance),
    ]
    
    for name, method in test_methods:
        try:
            df = method()
            results[name] = {
                "status": "OK",
                "rows": len(df),
                "columns": len(df.columns),
                "columnas": list(df.columns[:5])  # Primeras 5 columnas
            }
        except Exception as e:
            results[name] = {
                "status": "ERROR",
                "error": str(e)
            }
    
    return {
        "status": "test_completed",
        "results": results
    }

# Registrar routers
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(balances.router, prefix="/api/balances", tags=["Balances"])
app.include_router(models.router, prefix="/api/models", tags=["Modelos"])
app.include_router(correlations.router, prefix="/api/correlations", tags=["Correlaciones"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alertas"])
app.include_router(reliability.router, prefix="/api/reliability", tags=["Confiabilidad"])
app.include_router(benchmark.router, prefix="/api/benchmark", tags=["Benchmark"])
app.include_router(forecast.router, prefix="/api/forecast", tags=["Pronósticos"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_RELOAD
    )
