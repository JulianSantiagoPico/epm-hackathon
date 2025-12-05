"""Rutas de Confiabilidad - Scores y niveles de confiabilidad de modelos"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import pandas as pd
from app.services.data_loader import data_loader
from app.schemas.responses import (
    ReliabilityResponse,
    ReliabilityScore
)

router = APIRouter()


@router.get(
    "/",
    response_model=ReliabilityResponse,
    summary="Scores de confiabilidad por válvula",
    description="Retorna el score de confiabilidad (0-100) y nivel para cada válvula"
)
def get_reliability_scores(
    valvula_id: Optional[str] = Query(None, description="Filtrar por válvula específica")
):
    """
    Obtiene los scores de confiabilidad de los modelos por válvula.
    
    El score indica qué tan confiable es el modelo para esa válvula específica,
    considerando la calidad de los datos y la performance del modelo.
    
    Niveles:
    - ALTA (≥80): Alta confiabilidad
    - MEDIA-ALTA (70-79): Confiabilidad media-alta
    - MEDIA (60-69): Confiabilidad media
    """
    try:
        df = data_loader.load_analisis_confiabilidad()
        
        if df.empty:
            return ReliabilityResponse(
                valves=[],
                promedio_score=0.0,
                total_valvulas=0
            )
        
        # Filtrar por válvula si se especifica
        if valvula_id:
            df = df[df['VALVULA'] == valvula_id]
            
            if df.empty:
                raise HTTPException(
                    status_code=404,
                    detail=f"No se encontró información de confiabilidad para {valvula_id}"
                )
        
        # Construir lista de scores
        scores = []
        for _, row in df.iterrows():
            score_val = row.get('SCORE', 0)
            mae_val = row.get('MAE', 0)
            mape_val = row.get('MAPE', 0)
            
            scores.append(ReliabilityScore(
                valvula=str(row['VALVULA']),
                score=float(score_val) if pd.notna(score_val) else 0.0,
                nivel=str(row['NIVEL']),
                mejor_modelo=str(row['MEJOR_MODELO']),
                mae=float(mae_val) if pd.notna(mae_val) else 0.0,
                mape=float(mape_val) if pd.notna(mape_val) else 0.0
            ))
        
        # Calcular promedio de scores
        promedio = df['SCORE'].mean()
        
        return ReliabilityResponse(
            valves=scores,
            promedio_score=round(float(promedio), 2) if pd.notna(promedio) else 0.0,
            total_valvulas=len(scores)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener scores de confiabilidad: {str(e)}"
        )


@router.get(
    "/{valvula_id}",
    response_model=ReliabilityScore,
    summary="Score de confiabilidad de una válvula",
    description="Retorna el score y nivel de confiabilidad para una válvula específica"
)
def get_valve_reliability(valvula_id: str):
    """
    Obtiene el score de confiabilidad para una válvula específica.
    """
    try:
        df = data_loader.load_analisis_confiabilidad()
        
        valve_data = df[df['VALVULA'] == valvula_id]
        
        if valve_data.empty:
            raise HTTPException(
                status_code=404,
                detail=f"Válvula '{valvula_id}' no encontrada"
            )
        
        row = valve_data.iloc[0]
        
        score_val = row.get('SCORE', 0)
        mae_val = row.get('MAE', 0)
        mape_val = row.get('MAPE', 0)
        
        return ReliabilityScore(
            valvula=str(row['VALVULA']),
            score=float(score_val) if pd.notna(score_val) else 0.0,
            nivel=str(row['NIVEL']),
            mejor_modelo=str(row['MEJOR_MODELO']),
            mae=float(mae_val) if pd.notna(mae_val) else 0.0,
            mape=float(mape_val) if pd.notna(mape_val) else 0.0
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener confiabilidad de {valvula_id}: {str(e)}"
        )
