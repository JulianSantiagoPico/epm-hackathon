"""Schemas Pydantic para respuestas de la API"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


# ==================== DASHBOARD SCHEMAS ====================

class KPIResponse(BaseModel):
    """KPIs principales del dashboard"""
    mae: float = Field(..., description="Mean Absolute Error promedio de todos los modelos")
    rmse: float = Field(..., description="Root Mean Squared Error promedio")
    r2: Optional[float] = Field(None, description="R² Score promedio")
    perdidas_totales: float = Field(..., description="Pérdidas totales en m³")
    valvulas_monitoreadas: int = Field(..., description="Cantidad de válvulas")
    indice_promedio: float = Field(..., description="Índice de pérdidas promedio (%)")
    mejor_modelo: str = Field(..., description="Modelo más común o con mejor performance global")
    modelos_unicos: int = Field(..., description="Cantidad de modelos diferentes usados")
    usa_modelo_por_valvula: bool = Field(True, description="Indica si cada válvula usa un modelo específico")


class LossIndexPoint(BaseModel):
    """Punto de evolución del índice de pérdidas"""
    periodo: str
    indice_real: Optional[float]
    indice_predicho: Optional[float]


class TopValve(BaseModel):
    """Válvula en el top de desbalances"""
    valvula: str
    perdidas_promedio: float
    indice_perdidas: float
    entrada_promedio: float
    salida_promedio: float
    num_periodos: int


# ==================== BALANCE SCHEMAS ====================

class BalanceData(BaseModel):
    """Balance mensual individual"""
    periodo: str
    fecha: Optional[datetime]
    entrada: Optional[float] = Field(None, description="Volumen entrada en m³")
    salida: Optional[float] = Field(None, description="Volumen salida en m³")
    perdidas: Optional[float] = Field(None, description="Volumen pérdidas en m³")
    indice: Optional[float] = Field(None, description="Índice de pérdidas (%)")
    es_pronostico: bool = Field(..., description="¿Es dato pronosticado?")


class BalanceKPIs(BaseModel):
    """KPIs agregados por válvula"""
    indice_promedio: float
    total_perdidas: float
    meses_analizados: int


class BalanceResponse(BaseModel):
    """Respuesta completa de balances por válvula"""
    valvula_id: str
    kpis: BalanceKPIs
    balances: List[BalanceData]


# ==================== MODEL SCHEMAS ====================

class ModelMetrics(BaseModel):
    """Métricas de un modelo"""
    mae: float
    rmse: float
    mape: Optional[float] = None
    mase: Optional[float] = None
    r2: Optional[float] = None
    n_test: Optional[int] = None


class ModelInfo(BaseModel):
    """Información de un modelo de ML"""
    id: str
    name: str
    valvula: Optional[str] = None
    metrics: ModelMetrics


class ModelsComparisonResponse(BaseModel):
    """Comparación de modelos"""
    models: List[ModelInfo]


class BestModelByValve(BaseModel):
    """Mejor modelo para una válvula específica"""
    valvula: str
    mejor_modelo: str
    mae: float
    rmse: float
    mape: Optional[float] = None
    mase: Optional[float] = None
    r2: Optional[float] = None


class BestModelsByValveResponse(BaseModel):
    """Respuesta con mejor modelo por válvula"""
    valves: List[BestModelByValve]
    total_valvulas: int


class PredictionScatterPoint(BaseModel):
    """Punto de datos real vs predicho para scatter plot"""
    id: int
    real: float
    predicted: float
    valvula: Optional[str] = None
    periodo: Optional[str] = None


class PredictionScatterResponse(BaseModel):
    """Respuesta con datos de scatter plot real vs predicho"""
    modelo: str
    valvula: Optional[str] = None
    data: List[PredictionScatterPoint]
    total_puntos: int
    error_promedio: float = Field(..., description="Error promedio absoluto")
    correlacion: Optional[float] = Field(None, description="Coeficiente de correlación")


class FeatureImportance(BaseModel):
    """Importancia de una característica en el modelo"""
    name: str
    importance: float


class ModelDetailsResponse(BaseModel):
    """Detalles técnicos completos de un modelo"""
    id: str
    name: str
    version: str
    framework: str
    trained_on: str = Field(..., description="Fecha de entrenamiento")
    data_points: int = Field(..., description="Cantidad de datos de entrenamiento")
    hyperparameters: Dict = Field(..., description="Diccionario de hiperparámetros")
    features: List[FeatureImportance]
    metrics: ModelMetrics


class ReliabilityScore(BaseModel):
    """Score de confiabilidad de un modelo por válvula"""
    valvula: str
    score: float = Field(..., description="Score de confiabilidad (0-100)")
    nivel: str = Field(..., description="Nivel: ALTA, MEDIA-ALTA, etc.")
    mejor_modelo: str
    mae: float
    mape: float


class ReliabilityResponse(BaseModel):
    """Respuesta con scores de confiabilidad"""
    valves: List[ReliabilityScore]
    promedio_score: float
    total_valvulas: int


class BenchmarkComparison(BaseModel):
    """Comparación de histórico vs pronóstico para una válvula"""
    valvula: str
    entrada_hist: float
    entrada_pred: float
    salida_hist: float
    salida_pred: float
    perdidas_hist: float
    perdidas_pred: float
    indice_hist: float
    indice_pred: float
    dif_entrada_pct: float = Field(..., description="Diferencia % en entrada")
    dif_salida_pct: float = Field(..., description="Diferencia % en salida")
    dif_indice_pct: float = Field(..., description="Diferencia % en índice")


class BenchmarkResponse(BaseModel):
    """Respuesta con benchmark histórico vs pronóstico"""
    comparisons: List[BenchmarkComparison]
    promedio_precision_entrada: float
    promedio_precision_salida: float
    promedio_precision_indice: float


class ForecastSummary(BaseModel):
    """Resumen de pronósticos para una válvula"""
    valvula: str
    num_periodos: int
    volumen_entrada_total: float
    volumen_entrada_promedio: float
    volumen_salida_total: float
    volumen_salida_promedio: float
    perdidas_total: float
    perdidas_promedio: float
    indice_perdidas_promedio: float


class ForecastSummaryResponse(BaseModel):
    """Respuesta con resumen de pronósticos por válvula"""
    forecasts: List[ForecastSummary]
    total_valvulas: int


# ==================== CORRELATION SCHEMAS ====================

class CorrelationMatrix(BaseModel):
    """Matriz de correlación"""
    variables: List[str]
    matrix: List[List[float]]


class CorrelationPair(BaseModel):
    """Par de variables correlacionadas"""
    var1: str
    var2: str
    corr: float


class TopCorrelationsResponse(BaseModel):
    """Top correlaciones positivas y negativas"""
    top_positive: List[CorrelationPair]
    top_negative: List[CorrelationPair]


class CorrelationScatterPoint(BaseModel):
    """Punto de datos para scatter plot de correlación"""
    x: float = Field(..., description="Valor de la variable X")
    y: float = Field(..., description="Valor de la variable Y")
    valvula: str = Field(..., description="ID de la válvula")
    periodo: str = Field(..., description="Período del dato")


class CorrelationScatterResponse(BaseModel):
    """Respuesta con datos de scatter plot entre dos variables"""
    var_x: str = Field(..., description="Nombre de la variable X")
    var_y: str = Field(..., description="Nombre de la variable Y")
    data: List[CorrelationScatterPoint] = Field(..., description="Puntos del scatter plot")
    correlation: float = Field(..., description="Coeficiente de correlación de Pearson")
    total_puntos: int = Field(..., description="Total de puntos de datos")


# ==================== ALERT SCHEMAS ====================

class AlertMetrics(BaseModel):
    """Métricas asociadas a una alerta"""
    indice_perdidas: Optional[float] = None
    entrada_promedio: Optional[float] = None
    volumen_perdido: Optional[float] = None
    desviacion: Optional[float] = None
    umbral: Optional[float] = None


class Alert(BaseModel):
    """Alerta de desbalance o anomalía"""
    id: int = Field(..., description="ID único de la alerta")
    fecha: str = Field(..., description="Fecha y hora de la alerta")
    valvula: str = Field(..., description="ID de la válvula")
    ubicacion: str = Field(..., description="Ubicación o sector de la válvula")
    tipo: str = Field(..., description="Tipo: Desbalance, Anomalía")
    severidad: str = Field(..., description="Severidad: critica, alta, media, baja")
    descripcion: str = Field(..., description="Descripción detallada de la alerta")
    estado: str = Field(..., description="Estado: pendiente, revisada, resuelta")
    metricas: AlertMetrics = Field(..., description="Métricas asociadas")


class AlertsResponse(BaseModel):
    """Lista de alertas"""
    alertas: List[Alert]
    total: int


class AlertStats(BaseModel):
    """Estadísticas de alertas por severidad"""
    total: int
    criticas: int
    altas: int
    medias: int
    bajas: int = 0


class AlertStatsExtended(BaseModel):
    """Estadísticas extendidas de alertas"""
    # Por estado
    pendientes: int = 0
    revisadas: int = 0
    resueltas: int = 0
    total: int = 0
    # Por severidad
    criticas: int = 0
    altas: int = 0
    medias: int = 0
    bajas: int = 0


class AlertUpdateRequest(BaseModel):
    """Request para actualizar el estado de una alerta"""
    estado: str = Field(..., description="Nuevo estado: pendiente, revisada, resuelta")


class AlertUpdateResponse(BaseModel):
    """Respuesta al actualizar una alerta"""
    success: bool
    message: str
    alert: Optional[Alert] = None


# ==================== PREDICTION SCHEMAS ====================

class PredictionData(BaseModel):
    """Predicción de un período futuro"""
    periodo: str
    fecha: datetime
    volumen_predicho: float
    modelo: str
    intervalo_confianza: Optional[Dict[str, float]] = None


class PredictionResponse(BaseModel):
    """Respuesta de predicciones"""
    valvula_id: str
    predicciones: List[PredictionData]


# ==================== UTILITY SCHEMAS ====================

class ValvulasList(BaseModel):
    """Lista de válvulas disponibles"""
    valvulas: List[str]


class PeriodosList(BaseModel):
    """Lista de períodos disponibles"""
    periodos: List[str]


class HealthCheckResponse(BaseModel):
    """Respuesta del health check"""
    status: str
    data_path_exists: bool
    data_path: str
    valvulas_disponibles: int = 0


class ErrorResponse(BaseModel):
    """Respuesta de error estándar"""
    detail: str
    error_code: Optional[str] = None
