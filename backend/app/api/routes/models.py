"""Rutas de Modelos - Métricas y comparación de modelos ML"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import pandas as pd
from app.services.data_loader import data_loader
from app.schemas.responses import (
    ModelsComparisonResponse,
    ModelInfo,
    ModelMetrics,
    BestModelsByValveResponse,
    BestModelByValve
)

router = APIRouter()


@router.get(
    "/metrics",
    response_model=ModelsComparisonResponse,
    summary="Obtener métricas de todos los modelos",
    description="Retorna las métricas de performance de todos los modelos ML entrenados"
)
def get_models_metrics(
    valvula_id: Optional[str] = Query(None, description="Filtrar por válvula específica")
):
    """
    Obtiene las métricas de todos los modelos.
    
    Métricas incluidas: MAE, RMSE, MAPE, MASE, R²
    """
    try:
        metrics_df = data_loader.load_metrics()
        
        if metrics_df.empty:
            return ModelsComparisonResponse(models=[])
        
        # Filtrar por válvula si se especifica
        if valvula_id:
            metrics_df = metrics_df[metrics_df['VALVULA'] == valvula_id]
        
        # Agrupar por modelo y calcular promedio de métricas
        models_list = []
        
        for modelo in metrics_df['MODELO'].unique():
            modelo_data = metrics_df[metrics_df['MODELO'] == modelo]
            
            # Calcular métricas promedio
            mae_val = modelo_data['MAE'].mean()
            mae = float(mae_val) if pd.notna(mae_val) else 0.0
            rmse_val = modelo_data['RMSE'].mean()
            rmse = float(rmse_val) if pd.notna(rmse_val) else 0.0
            
            mape = None
            if 'MAPE' in modelo_data.columns:
                mape_val = modelo_data['MAPE'].mean()
                mape = float(mape_val) if pd.notna(mape_val) else None
            
            mase = None
            if 'MASE' in modelo_data.columns:
                mase_val = modelo_data['MASE'].mean()
                mase = float(mase_val) if pd.notna(mase_val) else None
            
            # Calcular R² aproximado (1 - (RMSE/mean)²) si no está disponible
            r2 = None
            if 'R2' in modelo_data.columns:
                r2_val = modelo_data['R2'].mean()
                r2 = float(r2_val) if pd.notna(r2_val) else None
            
            models_list.append(ModelInfo(
                id=str(modelo).lower().replace(" ", "_"),
                name=str(modelo),
                valvula=valvula_id,
                metrics=ModelMetrics(
                    mae=round(mae, 4),
                    rmse=round(rmse, 4),
                    mape=round(mape, 4) if mape else None,
                    mase=round(mase, 4) if mase else None,
                    r2=round(r2, 4) if r2 else None,
                    n_test=int(modelo_data['N_TEST'].mean()) if 'N_TEST' in modelo_data.columns else None
                )
            ))
        
        # Ordenar por MAE (mejor primero)
        models_list.sort(key=lambda x: x.metrics.mae)
        
        return ModelsComparisonResponse(models=models_list)
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener métricas de modelos: {str(e)}"
        )


@router.get(
    "/comparison",
    summary="Comparación de modelos por métrica",
    description="Compara modelos usando una métrica específica (MAE, RMSE, MAPE)"
)
def get_models_comparison(
    metric: str = Query("mae", description="Métrica a comparar: mae, rmse, mape"),
    valvula_id: Optional[str] = Query(None, description="Filtrar por válvula")
):
    """
    Retorna datos para gráficos de comparación entre modelos.
    """
    try:
        metrics_df = data_loader.load_metrics()
        
        if metrics_df.empty:
            return {"models": [], "metric": metric}
        
        # Filtrar por válvula si se especifica
        if valvula_id:
            metrics_df = metrics_df[metrics_df['VALVULA'] == valvula_id]
        
        # Validar métrica
        metric_col = metric.upper()
        if metric_col not in metrics_df.columns:
            raise HTTPException(
                status_code=400,
                detail=f"Métrica '{metric}' no válida. Opciones: mae, rmse, mape, mase"
            )
        
        # Agrupar por modelo
        comparison = []
        for modelo in metrics_df['MODELO'].unique():
            modelo_data = metrics_df[metrics_df['MODELO'] == modelo]
            value_mean = modelo_data[metric_col].mean()
            value = float(value_mean) if pd.notna(value_mean) else 0.0
            
            comparison.append({
                "modelo": str(modelo),
                "value": round(value, 4),
                "n_valves": len(modelo_data)
            })
        
        # Ordenar por valor (menor es mejor)
        comparison.sort(key=lambda x: x['value'])
        
        return {
            "metric": metric,
            "models": comparison
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error en comparación de modelos: {str(e)}"
        )


@router.get(
    "/best",
    summary="Obtener el mejor modelo",
    description="Retorna el modelo con mejor performance según la métrica especificada"
)
def get_best_model(
    metric: str = Query("mae", description="Métrica para evaluar: mae, rmse, mape")
):
    """
    Obtiene el modelo con mejor performance.
    """
    try:
        metrics_df = data_loader.load_metrics()
        
        if metrics_df.empty:
            raise HTTPException(status_code=404, detail="No hay datos de modelos disponibles")
        
        metric_col = metric.upper()
        if metric_col not in metrics_df.columns:
            raise HTTPException(
                status_code=400,
                detail=f"Métrica '{metric}' no válida"
            )
        
        # Encontrar el mejor modelo (menor valor en la métrica)
        best_idx = metrics_df[metric_col].idxmin()
        best_row = metrics_df.loc[best_idx]
        
        metric_val = best_row[metric_col]
        mae_val = best_row['MAE']
        rmse_val = best_row['RMSE']
        mape_val = best_row.get('MAPE', None)
        
        return {
            "modelo": str(best_row['MODELO']),
            "valvula": str(best_row['VALVULA']),
            "metric": metric,
            "value": round(float(metric_val), 4) if pd.notna(metric_val) else 0.0,
            "mae": round(float(mae_val), 4) if pd.notna(mae_val) else 0.0,
            "rmse": round(float(rmse_val), 4) if pd.notna(rmse_val) else 0.0,
            "mape": round(float(mape_val), 4) if 'MAPE' in best_row and pd.notna(mape_val) else None
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener mejor modelo: {str(e)}"
        )


@router.get(
    "/best-by-valve",
    response_model=BestModelsByValveResponse,
    summary="Mejor modelo por válvula",
    description="Retorna el mejor modelo para cada válvula (refleja que cada válvula usa un modelo diferente)"
)
def get_best_models_by_valve(
    metric: str = Query("mae", description="Métrica para evaluar: mae, rmse, mape")
):
    """
    Obtiene el mejor modelo para cada válvula.
    
    Esto refleja la realidad de que debido a la variabilidad de los datos,
    cada válvula tiene su propio mejor modelo optimizado.
    """
    try:
        metrics_df = data_loader.load_metrics()
        
        if metrics_df.empty:
            return BestModelsByValveResponse(valves=[], total_valvulas=0)
        
        metric_col = metric.upper()
        if metric_col not in metrics_df.columns:
            raise HTTPException(
                status_code=400,
                detail=f"Métrica '{metric}' no válida"
            )
        
        # Encontrar el mejor modelo para cada válvula
        best_models = []
        
        for valvula in metrics_df['VALVULA'].unique():
            valvula_data = metrics_df[metrics_df['VALVULA'] == valvula]
            
            # Encontrar el mejor modelo para esta válvula (menor métrica)
            best_idx = valvula_data[metric_col].idxmin()
            best_row = valvula_data.loc[best_idx]
            
            mae_val = best_row['MAE']
            rmse_val = best_row['RMSE']
            mape_val = best_row.get('MAPE', None)
            mase_val = best_row.get('MASE', None)
            r2_val = best_row.get('R2', None)
            
            best_models.append(BestModelByValve(
                valvula=str(valvula),
                mejor_modelo=str(best_row['MODELO']),
                mae=round(float(mae_val), 4) if pd.notna(mae_val) else 0.0,
                rmse=round(float(rmse_val), 4) if pd.notna(rmse_val) else 0.0,
                mape=round(float(mape_val), 4) if pd.notna(mape_val) else None,
                mase=round(float(mase_val), 4) if pd.notna(mase_val) else None,
                r2=round(float(r2_val), 4) if pd.notna(r2_val) else None
            ))
        
        # Ordenar por MAE (mejor performance primero)
        best_models.sort(key=lambda x: x.mae)
        
        return BestModelsByValveResponse(
            valves=best_models,
            total_valvulas=len(best_models)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener mejores modelos por válvula: {str(e)}"
        )
