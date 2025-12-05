"""Rutas de Correlaciones - Análisis de correlaciones entre variables"""
from fastapi import APIRouter, HTTPException
from typing import Optional
import numpy as np
from app.services.data_loader import data_loader
from app.schemas.responses import (
    CorrelationMatrix,
    TopCorrelationsResponse,
    CorrelationPair,
    CorrelationScatterPoint,
    CorrelationScatterResponse
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


@router.get(
    "/scatter",
    response_model=CorrelationScatterResponse,
    summary="Scatter plot entre dos variables",
    description="Obtiene datos para visualizar un scatter plot entre dos variables del sistema"
)
def get_correlation_scatter(
    var_x: str,
    var_y: str,
    valvula_id: Optional[str] = None
):
    """
    Obtiene puntos de datos para un scatter plot entre dos variables.
    
    Args:
        var_x: Nombre de la variable para el eje X
        var_y: Nombre de la variable para el eje Y
        valvula_id: (Opcional) Filtrar por válvula específica
        
    Retorna:
        CorrelationScatterResponse con puntos de datos y correlación
        
    Ejemplo:
        GET /api/correlations/scatter?var_x=VOLUMEN_ENTRADA_FINAL&var_y=INDICE_PERDIDAS_FINAL
        GET /api/correlations/scatter?var_x=PRESION_FINAL&var_y=TEMPERATURA_FINAL&valvula_id=VALVULA_1
    """
    try:
        # Cargar dataset maestro con todas las variables
        df = data_loader.load_dataset_maestro()
        
        if df.empty:
            raise HTTPException(status_code=404, detail="Datos no disponibles")
        
        # Verificar que las variables existen
        available_vars = df.columns.tolist()
        if var_x not in available_vars:
            raise HTTPException(
                status_code=404,
                detail=f"Variable '{var_x}' no encontrada. Disponibles: {available_vars}"
            )
        if var_y not in available_vars:
            raise HTTPException(
                status_code=404,
                detail=f"Variable '{var_y}' no encontrada. Disponibles: {available_vars}"
            )
        
        # Filtrar por válvula si se especifica
        if valvula_id:
            if 'VALVULA' not in df.columns:
                raise HTTPException(status_code=400, detail="Columna VALVULA no encontrada en los datos")
            df = df[df['VALVULA'] == valvula_id]
            if df.empty:
                raise HTTPException(
                    status_code=404,
                    detail=f"No hay datos para la válvula {valvula_id}"
                )
        
        # Calcular correlación primero (antes de cualquier procesamiento)
        if var_x == var_y:
            correlation = 1.0
        else:
            # Solo calcular correlación si las variables son diferentes
            df_corr = df[[var_x, var_y]].dropna()
            if len(df_corr) > 1:
                corr_matrix = df_corr.corr()
                correlation = float(corr_matrix.iloc[0, 1])
                if np.isnan(correlation):
                    correlation = 0.0
            else:
                correlation = 0.0
        
        # Seleccionar columnas necesarias y limpiar
        df_clean = df[['VALVULA', 'PERIODO', var_x]].copy()
        
        # Si las variables son diferentes, agregar la columna Y
        if var_x != var_y:
            df_clean['var_y_temp'] = df[var_y]
            df_clean = df_clean.dropna(subset=[var_x, 'var_y_temp'])
        else:
            df_clean = df_clean.dropna(subset=[var_x])
        
        if df_clean.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No hay datos válidos para las variables {var_x} y {var_y}"
            )
        
        # Crear puntos de scatter
        scatter_points = []
        for idx in range(len(df_clean)):
            try:
                row = df_clean.iloc[idx]
                x_val = float(row[var_x])
                
                # Para Y, usar la misma variable si son iguales
                if var_x == var_y:
                    y_val = x_val
                else:
                    y_val = float(row['var_y_temp'])
                
                scatter_points.append(
                    CorrelationScatterPoint(
                        x=x_val,
                        y=y_val,
                        valvula=str(row['VALVULA']),
                        periodo=str(row['PERIODO'])
                    )
                )
            except (ValueError, TypeError, KeyError) as e:
                # Saltar puntos con problemas de conversión
                continue
        
        return CorrelationScatterResponse(
            var_x=var_x,
            var_y=var_y,
            data=scatter_points,
            correlation=round(float(correlation), 4),
            total_puntos=len(scatter_points)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener scatter plot: {str(e)}"
        )
