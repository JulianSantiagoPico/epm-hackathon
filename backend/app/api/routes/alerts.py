"""Rutas de Alertas - Sistema de alertas y notificaciones"""
from fastapi import APIRouter, HTTPException, Query, Path, Body
from typing import Optional
import pandas as pd
from datetime import datetime, timedelta
import random
from app.services.data_loader import data_loader
from app.schemas.responses import (
    AlertsResponse,
    Alert,
    AlertMetrics,
    AlertStats,
    AlertStatsExtended,
    AlertUpdateRequest,
    AlertUpdateResponse
)

router = APIRouter()

# Almacenamiento en memoria para estados de alertas (en producción sería una BD)
alert_states = {}

# Mapeo de válvulas a sectores
VALVE_SECTORS = {
    "VALVULA_1": "Sector Norte",
    "VALVULA_2": "Sector Centro", 
    "VALVULA_3": "Sector Sur",
    "VALVULA_4": "Sector Este",
    "VALVULA_5": "Sector Oeste"
}


def _generate_alert_description(nivel: str, mensajes: str, indice: float) -> str:
    """Genera una descripción detallada basada en los datos de la alerta"""
    if "Pérdidas negativas" in mensajes:
        num_periodos = mensajes.split("periodo(s)")[0].split()[-1]
        return f"Detección de pérdidas negativas en {num_periodos} periodo(s). Índice de pérdidas de {abs(indice):.1f}%. Requiere revisión de datos o posibles inconsistencias en mediciones."
    elif nivel.upper() in ["CRITICO", "CRÍTICO"]:
        return f"Índice de pérdidas crítico detectado ({abs(indice):.1f}%). Se superó el umbral crítico. Requiere intervención inmediata del equipo técnico."
    elif nivel.upper() == "ALTO":
        return f"Pérdidas superiores al promedio histórico. Índice de pérdidas en {abs(indice):.1f}%. Se recomienda investigación detallada."
    elif nivel.upper() == "MEDIO":
        return f"Índice de pérdidas ligeramente por encima del promedio ({abs(indice):.1f}%). Requiere seguimiento y monitoreo."
    else:
        return f"Desviación menor detectada. Índice de pérdidas: {abs(indice):.1f}%."


def _determine_alert_type(nivel: str, indice: float) -> str:
    """Determina el tipo de alerta basado en los datos"""
    if indice < 0:
        return "Anomalía"
    elif nivel.upper() in ["CRITICO", "CRÍTICO", "ALTO"]:
        return "Desbalance"
    else:
        return "Anomalía"


def _normalize_severity(nivel: str) -> str:
    """Normaliza el nivel de severidad al formato del frontend"""
    nivel_upper = nivel.upper()
    if nivel_upper in ["CRITICO", "CRÍTICO"]:
        return "critica"
    elif nivel_upper == "ALTO":
        return "alta"
    elif nivel_upper == "MEDIO":
        return "media"
    elif nivel_upper == "BAJO":
        return "baja"
    return "media"


def _generate_alert_date(idx: int) -> str:
    """Genera una fecha reciente para la alerta"""
    # Genera fechas recientes (últimos 5 días)
    days_ago = idx % 5
    hours = random.randint(7, 20)
    minutes = random.randint(0, 59)
    alert_date = datetime.now() - timedelta(days=days_ago, hours=hours, minutes=minutes)
    return alert_date.strftime("%Y-%m-%d %H:%M")


def _get_default_alert_state(severidad: str) -> str:
    """Determina el estado inicial basado en la severidad"""
    if severidad == "critica":
        return "pendiente"
    elif severidad == "alta":
        return random.choice(["pendiente", "revisada"])
    else:
        return random.choice(["revisada", "resuelta"])


def _get_all_alerts_internal(
    nivel: Optional[str] = None,
    valvula: Optional[str] = None,
    estado: Optional[str] = None,
    tipo: Optional[str] = None,
    severidad: Optional[str] = None
):
    """
    Lógica interna para obtener alertas.
    Evita problemas con los objetos Query de FastAPI cuando se llama internamente.
    """
    try:
        alertas_df = data_loader.load_alertas()
        
        if alertas_df.empty:
            return AlertsResponse(alertas=[], total=0)
        
        # Aplicar filtro por nivel si se especifica
        if nivel:
            alertas_df = alertas_df[alertas_df['NIVEL'].str.upper() == nivel.upper()]
        
        # Aplicar filtro por válvula si se especifica
        if valvula:
            alertas_df = alertas_df[alertas_df['VALVULA'] == valvula]
        
        # Convertir a lista de alertas enriquecidas
        alertas_list = []
        for idx, row in alertas_df.iterrows():
            alert_id = idx + 1
            valvula_id = str(row['VALVULA'])
            nivel_raw = str(row['NIVEL'])
            mensajes = str(row['MENSAJES'])
            indice_val = row.get('INDICE_PERDIDAS_%', 0)
            entrada_val = row.get('ENTRADA_PROMEDIO', None)
            
            # Normalizar severidad
            severidad_norm = _normalize_severity(nivel_raw)
            
            # Determinar tipo de alerta
            tipo_alert = _determine_alert_type(nivel_raw, float(indice_val) if pd.notna(indice_val) else 0)
            
            # Obtener o generar estado
            if alert_id not in alert_states:
                alert_states[alert_id] = _get_default_alert_state(severidad_norm)
            
            # Generar fecha
            fecha_str = _generate_alert_date(idx)
            
            # Obtener ubicación
            ubicacion = VALVE_SECTORS.get(valvula_id, "Sector Desconocido")
            
            # Generar descripción
            descripcion = _generate_alert_description(nivel_raw, mensajes, float(indice_val) if pd.notna(indice_val) else 0)
            
            # Calcular volumen perdido estimado (si tenemos entrada promedio)
            volumen_perdido = None
            if entrada_val is not None and pd.notna(entrada_val) and pd.notna(indice_val):
                volumen_perdido = abs(float(entrada_val) * float(indice_val) / 100)
            
            alert = Alert(
                id=alert_id,
                fecha=fecha_str,
                valvula=valvula_id,
                ubicacion=ubicacion,
                tipo=tipo_alert,
                severidad=severidad_norm,
                descripcion=descripcion,
                estado=alert_states[alert_id],
                metricas=AlertMetrics(
                    indice_perdidas=round(abs(float(indice_val)), 2) if pd.notna(indice_val) else None,
                    entrada_promedio=round(float(entrada_val), 2) if entrada_val is not None and pd.notna(entrada_val) else None,
                    volumen_perdido=round(volumen_perdido, 2) if volumen_perdido else None,
                    umbral=12.0 if severidad_norm in ["critica", "alta"] else None
                )
            )
            
            alertas_list.append(alert)
        
        # Aplicar filtros adicionales del frontend
        if estado:
            alertas_list = [a for a in alertas_list if a.estado == estado]
        
        if tipo:
            alertas_list = [a for a in alertas_list if a.tipo == tipo]
        
        if severidad:
            alertas_list = [a for a in alertas_list if a.severidad == severidad]
        
        return AlertsResponse(
            alertas=alertas_list,
            total=len(alertas_list)
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener alertas: {str(e)}"
        )


@router.get(
    "/",
    response_model=AlertsResponse,
    summary="Obtener todas las alertas",
    description="Lista todas las alertas activas del sistema de balances virtuales con filtros opcionales"
)
def get_all_alerts(
    nivel: Optional[str] = Query(None, description="Filtrar por nivel: BAJO, MEDIO, ALTO, CRITICO"),
    valvula: Optional[str] = Query(None, description="Filtrar por válvula específica"),
    estado: Optional[str] = Query(None, description="Filtrar por estado: pendiente, revisada, resuelta"),
    tipo: Optional[str] = Query(None, description="Filtrar por tipo: Desbalance, Anomalía"),
    severidad: Optional[str] = Query(None, description="Filtrar por severidad: critica, alta, media, baja")
):
    """
    Obtiene todas las alertas del sistema con soporte para múltiples filtros.
    """
    return _get_all_alerts_internal(nivel, valvula, estado, tipo, severidad)


@router.get(
    "/stats",
    response_model=AlertStatsExtended,
    summary="Estadísticas extendidas de alertas",
    description="Retorna contadores de alertas por nivel de severidad y estado"
)
def get_alert_stats():
    """
    Obtiene estadísticas agregadas de alertas.
    
    Retorna conteo por estado y por severidad.
    """
    try:
        # Primero obtenemos todas las alertas (esto las inicializa si es necesario)
        response = _get_all_alerts_internal()
        alertas = response.alertas
        
        if not alertas:
            return AlertStatsExtended(
                total=0,
                pendientes=0,
                revisadas=0,
                resueltas=0,
                criticas=0,
                altas=0,
                medias=0,
                bajas=0
            )
        
        # Contar por estado
        pendientes = sum(1 for a in alertas if a.estado == "pendiente")
        revisadas = sum(1 for a in alertas if a.estado == "revisada")
        resueltas = sum(1 for a in alertas if a.estado == "resuelta")
        
        # Contar por severidad
        criticas = sum(1 for a in alertas if a.severidad == "critica")
        altas = sum(1 for a in alertas if a.severidad == "alta")
        medias = sum(1 for a in alertas if a.severidad == "media")
        bajas = sum(1 for a in alertas if a.severidad == "baja")
        
        return AlertStatsExtended(
            total=len(alertas),
            pendientes=pendientes,
            revisadas=revisadas,
            resueltas=resueltas,
            criticas=criticas,
            altas=altas,
            medias=medias,
            bajas=bajas
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener estadísticas de alertas: {str(e)}"
        )


@router.get(
    "/valvula/{valvula_id}",
    response_model=AlertsResponse,
    summary="Alertas de una válvula específica",
    description="Obtiene todas las alertas asociadas a una válvula"
)
def get_valve_alerts(
    valvula_id: str = Path(..., description="ID de la válvula (ej: VALVULA_1)")
):
    """
    Obtiene las alertas de una válvula específica.
    """
    try:
        # Usamos el endpoint principal con filtro de válvula
        return _get_all_alerts_internal(valvula=valvula_id)
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener alertas de válvula: {str(e)}"
        )


@router.get(
    "/critical",
    response_model=AlertsResponse,
    summary="Alertas críticas",
    description="Obtiene solo las alertas de nivel crítico"
)
def get_critical_alerts():
    """
    Retorna únicamente las alertas críticas del sistema.
    """
    try:
        # Usamos el endpoint principal con filtro de severidad crítica
        response = _get_all_alerts_internal(severidad="critica")
        
        return AlertsResponse(
            alertas=response.alertas,
            total=response.total
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener alertas críticas: {str(e)}"
        )


@router.patch(
    "/{alert_id}",
    response_model=AlertUpdateResponse,
    summary="Actualizar estado de una alerta",
    description="Actualiza el estado de una alerta específica (pendiente, revisada, resuelta)"
)
def update_alert_status(
    alert_id: int = Path(..., description="ID de la alerta a actualizar"),
    update_data: AlertUpdateRequest = Body(..., description="Datos de actualización")
):
    """
    Actualiza el estado de una alerta.
    
    Estados permitidos:
    - pendiente: Alerta detectada pero no revisada
    - revisada: Alerta revisada por el equipo técnico
    - resuelta: Problema solucionado
    """
    try:
        # Validar estado
        estados_validos = ["pendiente", "revisada", "resuelta"]
        if update_data.estado not in estados_validos:
            raise HTTPException(
                status_code=400,
                detail=f"Estado inválido. Debe ser uno de: {', '.join(estados_validos)}"
            )
        
        # Obtener todas las alertas para validar que existe
        all_alerts = _get_all_alerts_internal()
        
        # Buscar la alerta
        alert_found = None
        for alert in all_alerts.alertas:
            if alert.id == alert_id:
                alert_found = alert
                break
        
        if not alert_found:
            raise HTTPException(
                status_code=404,
                detail=f"Alerta con ID {alert_id} no encontrada"
            )
        
        # Actualizar estado en memoria
        alert_states[alert_id] = update_data.estado
        
        # Obtener alerta actualizada
        updated_alert = None
        for alert in _get_all_alerts_internal().alertas:
            if alert.id == alert_id:
                updated_alert = alert
                break
        
        return AlertUpdateResponse(
            success=True,
            message=f"Estado de alerta {alert_id} actualizado a '{update_data.estado}'",
            alert=updated_alert
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al actualizar alerta: {str(e)}"
        )


@router.get(
    "/recent",
    response_model=AlertsResponse,
    summary="Alertas recientes",
    description="Obtiene las alertas más recientes (últimas 10)"
)
def get_recent_alerts(
    limit: int = Query(10, description="Número máximo de alertas a retornar", ge=1, le=100)
):
    """
    Obtiene las alertas más recientes del sistema.
    """
    try:
        all_alerts = _get_all_alerts_internal()
        
        # Ordenar por fecha (más recientes primero) y limitar
        alertas_sorted = sorted(
            all_alerts.alertas,
            key=lambda x: datetime.strptime(x.fecha, "%Y-%m-%d %H:%M"),
            reverse=True
        )[:limit]
        
        return AlertsResponse(
            alertas=alertas_sorted,
            total=len(alertas_sorted)
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener alertas recientes: {str(e)}"
        )
