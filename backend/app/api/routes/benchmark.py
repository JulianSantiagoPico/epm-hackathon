"""Rutas de Benchmark - Comparación histórico vs pronóstico"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import pandas as pd
from app.services.data_loader import data_loader
from app.schemas.responses import (
    BenchmarkResponse,
    BenchmarkComparison
)

router = APIRouter()


@router.get(
    "/historic-vs-forecast",
    response_model=BenchmarkResponse,
    summary="Comparación histórico vs pronóstico",
    description="Compara valores históricos agregados vs pronósticos para validar precisión"
)
def get_historic_vs_forecast_benchmark(
    valvula_id: Optional[str] = Query(None, description="Filtrar por válvula específica")
):
    """
    Obtiene la comparación entre valores históricos y pronósticos agregados.
    
    Incluye diferencias porcentuales para evaluar la precisión del modelo:
    - DIF_ENTRADA_%: Diferencia en volumen de entrada
    - DIF_SALIDA_%: Diferencia en volumen de salida  
    - DIF_INDICE_%: Diferencia en índice de pérdidas
    
    Útil para:
    - Validar precisión de pronósticos
    - Identificar válvulas con mayores desviaciones
    - Ajustar modelos según performance real
    """
    try:
        df = data_loader.load_benchmark_historico()
        
        if df.empty:
            return BenchmarkResponse(
                comparisons=[],
                promedio_precision_entrada=0.0,
                promedio_precision_salida=0.0,
                promedio_precision_indice=0.0
            )
        
        # Filtrar por válvula si se especifica
        if valvula_id:
            df = df[df['VALVULA'] == valvula_id]
            
            if df.empty:
                raise HTTPException(
                    status_code=404,
                    detail=f"No se encontró benchmark para {valvula_id}"
                )
        
        # Construir lista de comparaciones
        comparisons = []
        for _, row in df.iterrows():
            # Extraer valores con manejo de NaN
            entrada_hist = row.get('ENTRADA_HIST', 0)
            entrada_pred = row.get('ENTRADA_PRED', 0)
            salida_hist = row.get('SALIDA_HIST', 0)
            salida_pred = row.get('SALIDA_PRED', 0)
            perdidas_hist = row.get('PERDIDAS_HIST', 0)
            perdidas_pred = row.get('PERDIDAS_PRED', 0)
            indice_hist = row.get('INDICE_HIST', 0)
            indice_pred = row.get('INDICE_PRED', 0)
            dif_entrada = row.get('DIF_ENTRADA_%', 0)
            dif_salida = row.get('DIF_SALIDA_%', 0)
            dif_indice = row.get('DIF_INDICE_%', 0)
            
            comparisons.append(BenchmarkComparison(
                valvula=str(row['VALVULA']),
                entrada_hist=float(entrada_hist) if pd.notna(entrada_hist) else 0.0,
                entrada_pred=float(entrada_pred) if pd.notna(entrada_pred) else 0.0,
                salida_hist=float(salida_hist) if pd.notna(salida_hist) else 0.0,
                salida_pred=float(salida_pred) if pd.notna(salida_pred) else 0.0,
                perdidas_hist=float(perdidas_hist) if pd.notna(perdidas_hist) else 0.0,
                perdidas_pred=float(perdidas_pred) if pd.notna(perdidas_pred) else 0.0,
                indice_hist=float(indice_hist) if pd.notna(indice_hist) else 0.0,
                indice_pred=float(indice_pred) if pd.notna(indice_pred) else 0.0,
                dif_entrada_pct=float(dif_entrada) if pd.notna(dif_entrada) else 0.0,
                dif_salida_pct=float(dif_salida) if pd.notna(dif_salida) else 0.0,
                dif_indice_pct=float(dif_indice) if pd.notna(dif_indice) else 0.0
            ))
        
        # Calcular promedios de precisión (valor absoluto de diferencias)
        promedio_entrada = df['DIF_ENTRADA_%'].abs().mean()
        promedio_salida = df['DIF_SALIDA_%'].abs().mean()
        promedio_indice = df['DIF_INDICE_%'].abs().mean()
        
        return BenchmarkResponse(
            comparisons=comparisons,
            promedio_precision_entrada=round(float(promedio_entrada), 2) if pd.notna(promedio_entrada) else 0.0,
            promedio_precision_salida=round(float(promedio_salida), 2) if pd.notna(promedio_salida) else 0.0,
            promedio_precision_indice=round(float(promedio_indice), 2) if pd.notna(promedio_indice) else 0.0
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener benchmark: {str(e)}"
        )


@router.get(
    "/{valvula_id}/accuracy",
    response_model=BenchmarkComparison,
    summary="Precisión de pronóstico por válvula",
    description="Retorna la comparación histórico vs pronóstico para una válvula"
)
def get_valve_forecast_accuracy(valvula_id: str):
    """
    Obtiene la precisión del pronóstico para una válvula específica.
    
    Muestra la comparación entre valores históricos y predichos,
    incluyendo las diferencias porcentuales.
    """
    try:
        df = data_loader.load_benchmark_historico()
        
        valve_data = df[df['VALVULA'] == valvula_id]
        
        if valve_data.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No se encontró benchmark para válvula '{valvula_id}'"
            )
        
        row = valve_data.iloc[0]
        
        # Extraer valores con manejo de NaN
        entrada_hist = row.get('ENTRADA_HIST', 0)
        entrada_pred = row.get('ENTRADA_PRED', 0)
        salida_hist = row.get('SALIDA_HIST', 0)
        salida_pred = row.get('SALIDA_PRED', 0)
        perdidas_hist = row.get('PERDIDAS_HIST', 0)
        perdidas_pred = row.get('PERDIDAS_PRED', 0)
        indice_hist = row.get('INDICE_HIST', 0)
        indice_pred = row.get('INDICE_PRED', 0)
        dif_entrada = row.get('DIF_ENTRADA_%', 0)
        dif_salida = row.get('DIF_SALIDA_%', 0)
        dif_indice = row.get('DIF_INDICE_%', 0)
        
        return BenchmarkComparison(
            valvula=str(row['VALVULA']),
            entrada_hist=float(entrada_hist) if pd.notna(entrada_hist) else 0.0,
            entrada_pred=float(entrada_pred) if pd.notna(entrada_pred) else 0.0,
            salida_hist=float(salida_hist) if pd.notna(salida_hist) else 0.0,
            salida_pred=float(salida_pred) if pd.notna(salida_pred) else 0.0,
            perdidas_hist=float(perdidas_hist) if pd.notna(perdidas_hist) else 0.0,
            perdidas_pred=float(perdidas_pred) if pd.notna(perdidas_pred) else 0.0,
            indice_hist=float(indice_hist) if pd.notna(indice_hist) else 0.0,
            indice_pred=float(indice_pred) if pd.notna(indice_pred) else 0.0,
            dif_entrada_pct=float(dif_entrada) if pd.notna(dif_entrada) else 0.0,
            dif_salida_pct=float(dif_salida) if pd.notna(dif_salida) else 0.0,
            dif_indice_pct=float(dif_indice) if pd.notna(dif_indice) else 0.0
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener precisión de {valvula_id}: {str(e)}"
        )
