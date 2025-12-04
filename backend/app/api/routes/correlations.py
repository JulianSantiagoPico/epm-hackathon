"""Rutas de Correlaciones - Análisis de correlaciones entre variables"""
from fastapi import APIRouter, HTTPException
import numpy as np
from app.services.data_loader import data_loader
from app.schemas.responses import (
    CorrelationMatrix,
    TopCorrelationsResponse,
    CorrelationPair
)

router = APIRouter()


@router.get(
    "/matrix",
    response_model=CorrelationMatrix,
    summary="Obtener matriz de correlación",
    description="Retorna la matriz de correlación entre todas las variables del sistema"
)
def get_correlation_matrix():
    """
    Obtiene la matriz de correlación NxN entre variables.
    
    Variables incluidas:
    - Volumen entrada/salida
    - Pérdidas e índice de pérdidas
    - Presión, temperatura, KPT
    - Número de usuarios
    """
    try:
        corr_df = data_loader.load_correlations()
        
        if corr_df.empty:
            raise HTTPException(status_code=404, detail="Matriz de correlación no disponible")
        
        # Obtener nombres de variables y matriz
        variables = corr_df.index.tolist()
        matrix = corr_df.values.tolist()
        
        return CorrelationMatrix(
            variables=variables,
            matrix=matrix
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener matriz de correlación: {str(e)}"
        )


@router.get(
    "/top",
    response_model=TopCorrelationsResponse,
    summary="Top correlaciones positivas y negativas",
    description="Retorna las correlaciones más fuertes (positivas y negativas) entre variables"
)
def get_top_correlations(limit: int = 5):
    """
    Obtiene el top N de correlaciones más fuertes.
    
    Args:
        limit: Cantidad de correlaciones a retornar (default: 5)
    """
    try:
        corr_df = data_loader.load_correlations()
        
        if corr_df.empty:
            raise HTTPException(status_code=404, detail="Datos de correlación no disponibles")
        
        # Extraer triángulo superior (sin diagonal para evitar correlaciones perfectas de 1.0)
        mask = np.triu(np.ones_like(corr_df, dtype=bool), k=1)
        
        # Crear lista de pares de correlaciones
        correlations = []
        for i, var1 in enumerate(corr_df.index):
            for j, var2 in enumerate(corr_df.columns):
                if mask[i, j]:
                    corr_value = corr_df.iloc[i, j]
                    # Skip NaN correlations
                    if np.isnan(corr_value):
                        continue
                    correlations.append({
                        'var1': var1,
                        'var2': var2,
                        'corr': float(corr_value)
                    })
        
        # Ordenar por valor absoluto de correlación
        correlations.sort(key=lambda x: abs(x['corr']), reverse=True)
        
        # Separar positivas y negativas
        positive = [c for c in correlations if c['corr'] > 0][:limit]
        negative = [c for c in correlations if c['corr'] < 0][:limit]
        
        # Convertir a objetos Pydantic
        top_positive = [
            CorrelationPair(
                var1=c['var1'],
                var2=c['var2'],
                corr=round(c['corr'], 4)
            ) for c in positive
        ]
        
        top_negative = [
            CorrelationPair(
                var1=c['var1'],
                var2=c['var2'],
                corr=round(c['corr'], 4)
            ) for c in negative
        ]
        
        return TopCorrelationsResponse(
            top_positive=top_positive,
            top_negative=top_negative
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener top correlaciones: {str(e)}"
        )


@router.get(
    "/variable/{variable_name}",
    summary="Correlaciones de una variable específica",
    description="Obtiene todas las correlaciones de una variable con las demás"
)
def get_variable_correlations(variable_name: str):
    """
    Obtiene las correlaciones de una variable específica con todas las demás.
    """
    try:
        corr_df = data_loader.load_correlations()
        
        if corr_df.empty:
            raise HTTPException(status_code=404, detail="Datos de correlación no disponibles")
        
        # Verificar que la variable existe
        if variable_name not in corr_df.index:
            available = corr_df.index.tolist()
            raise HTTPException(
                status_code=404,
                detail=f"Variable '{variable_name}' no encontrada. Disponibles: {available}"
            )
        
        # Obtener correlaciones de la variable
        var_corr = corr_df.loc[variable_name].to_dict()
        
        # Convertir a lista ordenada (excluyendo correlación consigo misma)
        correlations = [
            {
                "variable": var,
                "correlation": round(float(corr), 4)
            }
            for var, corr in var_corr.items()
            if var != variable_name and not np.isnan(corr)
        ]
        
        # Ordenar por valor absoluto de correlación
        correlations.sort(key=lambda x: abs(x['correlation']), reverse=True)
        
        return {
            "variable": variable_name,
            "correlations": correlations,
            "strongest_positive": max(correlations, key=lambda x: x['correlation']),
            "strongest_negative": min(correlations, key=lambda x: x['correlation'])
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener correlaciones de variable: {str(e)}"
        )
