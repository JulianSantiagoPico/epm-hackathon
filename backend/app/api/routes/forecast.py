"""Rutas de Forecast - Resumen de pronósticos por válvula"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import pandas as pd
from app.services.data_loader import data_loader
from app.schemas.responses import (
    ForecastSummaryResponse,
    ForecastSummary
)

router = APIRouter()


@router.get(
    "/summary",
    response_model=ForecastSummaryResponse,
    summary="Resumen de pronósticos por válvula",
    description="Retorna agregados de todos los pronósticos generados por válvula"
)
def get_forecast_summary_by_valve(
    valvula_id: Optional[str] = Query(None, description="Filtrar por válvula específica")
):
    """
    Obtiene el resumen agregado de pronósticos por válvula.
    
    Incluye:
    - Número de períodos pronosticados
    - Totales y promedios de volúmenes de entrada/salida
    - Pérdidas totales y promedio
    - Índice de pérdidas promedio
    
    Útil para:
    - Comparar volúmenes pronosticados entre válvulas
    - Analizar tendencias de pérdidas esperadas
    - Planificación de recursos basada en pronósticos
    """
    try:
        df = data_loader.load_resumen_pronostico_valvulas()
        
        if df.empty:
            return ForecastSummaryResponse(
                forecasts=[],
                total_valvulas=0
            )
        
        # Filtrar por válvula si se especifica
        if valvula_id:
            df = df[df['VALVULA'] == valvula_id]
            
            if df.empty:
                raise HTTPException(
                    status_code=404,
                    detail=f"No se encontró resumen de pronósticos para {valvula_id}"
                )
        
        # Construir lista de resúmenes
        forecasts = []
        for _, row in df.iterrows():
            num_periodos = row.get('NUM_PERIODOS', 0)
            entrada_sum = row.get('VOLUMEN_ENTRADA_FINAL_SUM', 0)
            entrada_mean = row.get('VOLUMEN_ENTRADA_FINAL_MEAN', 0)
            salida_sum = row.get('VOLUMEN_SALIDA_FINAL_SUM', 0)
            salida_mean = row.get('VOLUMEN_SALIDA_FINAL_MEAN', 0)
            perdidas_sum = row.get('PERDIDAS_FINAL_SUM', 0)
            perdidas_mean = row.get('PERDIDAS_FINAL_MEAN', 0)
            indice_mean = row.get('INDICE_PERDIDAS_FINAL_MEAN', 0)
            
            forecasts.append(ForecastSummary(
                valvula=str(row['VALVULA']),
                num_periodos=int(num_periodos) if pd.notna(num_periodos) else 0,
                volumen_entrada_total=float(entrada_sum) if pd.notna(entrada_sum) else 0.0,
                volumen_entrada_promedio=float(entrada_mean) if pd.notna(entrada_mean) else 0.0,
                volumen_salida_total=float(salida_sum) if pd.notna(salida_sum) else 0.0,
                volumen_salida_promedio=float(salida_mean) if pd.notna(salida_mean) else 0.0,
                perdidas_total=float(perdidas_sum) if pd.notna(perdidas_sum) else 0.0,
                perdidas_promedio=float(perdidas_mean) if pd.notna(perdidas_mean) else 0.0,
                indice_perdidas_promedio=float(indice_mean) if pd.notna(indice_mean) else 0.0
            ))
        
        return ForecastSummaryResponse(
            forecasts=forecasts,
            total_valvulas=len(forecasts)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener resumen de pronósticos: {str(e)}"
        )


@router.get(
    "/{valvula_id}/summary",
    response_model=ForecastSummary,
    summary="Resumen de pronósticos de una válvula",
    description="Retorna el resumen agregado de pronósticos para una válvula específica"
)
def get_valve_forecast_summary(valvula_id: str):
    """
    Obtiene el resumen de pronósticos para una válvula específica.
    """
    try:
        df = data_loader.load_resumen_pronostico_valvulas()
        
        valve_data = df[df['VALVULA'] == valvula_id]
        
        if valve_data.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No se encontró resumen de pronósticos para '{valvula_id}'"
            )
        
        row = valve_data.iloc[0]
        
        num_periodos = row.get('NUM_PERIODOS', 0)
        entrada_sum = row.get('VOLUMEN_ENTRADA_FINAL_SUM', 0)
        entrada_mean = row.get('VOLUMEN_ENTRADA_FINAL_MEAN', 0)
        salida_sum = row.get('VOLUMEN_SALIDA_FINAL_SUM', 0)
        salida_mean = row.get('VOLUMEN_SALIDA_FINAL_MEAN', 0)
        perdidas_sum = row.get('PERDIDAS_FINAL_SUM', 0)
        perdidas_mean = row.get('PERDIDAS_FINAL_MEAN', 0)
        indice_mean = row.get('INDICE_PERDIDAS_FINAL_MEAN', 0)
        
        return ForecastSummary(
            valvula=str(row['VALVULA']),
            num_periodos=int(num_periodos) if pd.notna(num_periodos) else 0,
            volumen_entrada_total=float(entrada_sum) if pd.notna(entrada_sum) else 0.0,
            volumen_entrada_promedio=float(entrada_mean) if pd.notna(entrada_mean) else 0.0,
            volumen_salida_total=float(salida_sum) if pd.notna(salida_sum) else 0.0,
            volumen_salida_promedio=float(salida_mean) if pd.notna(salida_mean) else 0.0,
            perdidas_total=float(perdidas_sum) if pd.notna(perdidas_sum) else 0.0,
            perdidas_promedio=float(perdidas_mean) if pd.notna(perdidas_mean) else 0.0,
            indice_perdidas_promedio=float(indice_mean) if pd.notna(indice_mean) else 0.0
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener resumen de pronósticos de {valvula_id}: {str(e)}"
        )
