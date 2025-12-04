"""Rutas de Alertas - Sistema de alertas y notificaciones"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import pandas as pd
from app.services.data_loader import data_loader
from app.schemas.responses import (
    AlertsResponse,
    Alert,
    AlertMetrics,
    AlertStats
)

router = APIRouter()


@router.get(
    "/",
    response_model=AlertsResponse,
    summary="Obtener todas las alertas",
    description="Lista todas las alertas activas del sistema de balances virtuales"
)
def get_all_alerts(
    nivel: Optional[str] = Query(None, description="Filtrar por nivel: BAJO, MEDIO, ALTO, CRITICO"),
    valvula: Optional[str] = Query(None, description="Filtrar por válvula específica")
):
    """
    Obtiene todas las alertas del sistema.
    
    Las alertas se generan cuando:
    - Índice de pérdidas supera umbrales
    - Pérdidas negativas (inconsistencias)
    - Desbalances anormales
    """
    try:
        alertas_df = data_loader.load_alertas()
        
        if alertas_df.empty:
            return AlertsResponse(alertas=[], total=0)
        
        # Filtrar por nivel si se especifica
        if nivel:
            alertas_df = alertas_df[alertas_df['NIVEL'].str.upper() == nivel.upper()]
        
        # Filtrar por válvula si se especifica
        if valvula:
            alertas_df = alertas_df[alertas_df['VALVULA'] == valvula]
        
        # Convertir a lista de alertas
        alertas_list = []
        for _, row in alertas_df.iterrows():
            indice_val = row.get('INDICE_PERDIDAS_%', 0)
            entrada_val = row.get('ENTRADA_PROMEDIO', None)
            
            alertas_list.append(Alert(
                valvula=str(row['VALVULA']),
                nivel=str(row['NIVEL']),
                mensajes=str(row['MENSAJES']),
                metricas=AlertMetrics(
                    indice_perdidas=round(abs(float(indice_val)), 2) if pd.notna(indice_val) else 0.0,
                    entrada_promedio=round(float(entrada_val), 2) if entrada_val is not None and pd.notna(entrada_val) else None
                )
            ))
        
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
    "/stats",
    response_model=AlertStats,
    summary="Estadísticas de alertas",
    description="Retorna contadores de alertas por nivel de severidad"
)
def get_alert_stats():
    """
    Obtiene estadísticas agregadas de alertas.
    
    Retorna conteo por nivel: total, críticas, altas, medias, bajas.
    """
    try:
        alertas_df = data_loader.load_alertas()
        
        if alertas_df.empty:
            return AlertStats(
                total=0,
                criticas=0,
                altas=0,
                medias=0,
                bajas=0
            )
        
        # Contar por nivel (normalizar a mayúsculas)
        nivel_counts = alertas_df['NIVEL'].str.upper().value_counts().to_dict()
        
        return AlertStats(
            total=len(alertas_df),
            criticas=nivel_counts.get('CRITICO', 0) + nivel_counts.get('CRÍTICO', 0),
            altas=nivel_counts.get('ALTO', 0),
            medias=nivel_counts.get('MEDIO', 0),
            bajas=nivel_counts.get('BAJO', 0)
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener estadísticas de alertas: {str(e)}"
        )


@router.get(
    "/valvula/{valvula_id}",
    summary="Alertas de una válvula específica",
    description="Obtiene todas las alertas asociadas a una válvula"
)
def get_valve_alerts(valvula_id: str):
    """
    Obtiene las alertas de una válvula específica.
    """
    try:
        alertas_df = data_loader.load_alertas()
        
        if alertas_df.empty:
            return {
                "valvula": valvula_id,
                "alertas": [],
                "total": 0
            }
        
        # Filtrar por válvula
        valve_alerts = alertas_df[alertas_df['VALVULA'] == valvula_id]
        
        if valve_alerts.empty:
            return {
                "valvula": valvula_id,
                "alertas": [],
                "total": 0,
                "mensaje": f"No hay alertas para {valvula_id}"
            }
        
        # Convertir a lista
        alertas_list = []
        for _, row in valve_alerts.iterrows():
            indice_val = row.get('INDICE_PERDIDAS_%', 0)
            entrada_val = row.get('ENTRADA_PROMEDIO', None)
            
            alertas_list.append({
                "nivel": str(row['NIVEL']),
                "mensajes": str(row['MENSAJES']),
                "indice_perdidas": round(abs(float(indice_val)), 2) if pd.notna(indice_val) else 0.0,
                "entrada_promedio": round(float(entrada_val), 2) if entrada_val is not None and pd.notna(entrada_val) else None
            })
        
        return {
            "valvula": valvula_id,
            "alertas": alertas_list,
            "total": len(alertas_list),
            "nivel_mas_alto": valve_alerts['NIVEL'].iloc[0] if not valve_alerts.empty else None
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener alertas de válvula: {str(e)}"
        )


@router.get(
    "/critical",
    summary="Alertas críticas",
    description="Obtiene solo las alertas de nivel crítico"
)
def get_critical_alerts():
    """
    Retorna únicamente las alertas críticas del sistema.
    """
    try:
        alertas_df = data_loader.load_alertas()
        
        if alertas_df.empty:
            return {"alertas": [], "total": 0}
        
        # Filtrar críticas (normalizar a mayúsculas)
        critical = alertas_df[alertas_df['NIVEL'].str.upper().isin(['CRITICO', 'CRÍTICO', 'CRITICAL'])]
        
        alertas_list = []
        for _, row in critical.iterrows():
            indice_val = row.get('INDICE_PERDIDAS_%', 0)
            
            alertas_list.append({
                "valvula": str(row['VALVULA']),
                "mensajes": str(row['MENSAJES']),
                "indice_perdidas": round(abs(float(indice_val)), 2) if pd.notna(indice_val) else 0.0
            })
        
        return {
            "alertas": alertas_list,
            "total": len(alertas_list),
            "requires_immediate_action": len(alertas_list) > 0
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener alertas críticas: {str(e)}"
        )
