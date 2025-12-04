"""Rutas del Dashboard - KPIs principales y visualizaciones"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import pandas as pd
from app.services.data_loader import data_loader
from app.schemas.responses import (
    KPIResponse,
    LossIndexPoint,
    TopValve,
    ErrorResponse
)

router = APIRouter()


@router.get(
    "/kpis",
    response_model=KPIResponse,
    summary="KPIs principales del dashboard",
    description="Retorna métricas clave: MAE, RMSE, pérdidas totales, índice promedio, etc."
)
def get_dashboard_kpis():
    """
    Obtiene los KPIs principales para mostrar en el dashboard.
    
    Combina datos de:
    - Metrics.csv (métricas de modelos)
    - Resumen_Valvulas.csv (agregados por válvula)
    - Tabla_Balances_Virtuales.csv (balances totales)
    """
    try:
        # Cargar datos
        metrics_df = data_loader.load_metrics()
        resumen_df = data_loader.load_resumen_valvulas()
        balances_df = data_loader.load_balances_virtuales()
        
        # Encontrar el mejor modelo POR VÁLVULA (cada válvula tiene su mejor modelo)
        if not metrics_df.empty:
            # Encontrar el mejor modelo para cada válvula
            best_by_valve = []
            modelos_usados = set()
            
            for valvula in metrics_df['VALVULA'].unique():
                valvula_data = metrics_df[metrics_df['VALVULA'] == valvula]
                best_idx = valvula_data['MAE'].idxmin()
                best_row = valvula_data.loc[best_idx]
                best_by_valve.append(best_row)
                modelos_usados.add(str(best_row['MODELO']))
            
            # Calcular métricas promedio de los mejores modelos de cada válvula
            best_df = pd.DataFrame(best_by_valve)
            mae_val = best_df['MAE'].mean()
            mae = round(float(mae_val), 3) if pd.notna(mae_val) else 0.0
            rmse_val = best_df['RMSE'].mean()
            rmse = round(float(rmse_val), 3) if pd.notna(rmse_val) else 0.0
            
            # El "mejor modelo" es el más común entre los mejores por válvula
            mejor_modelo = best_df['MODELO'].mode()[0] if len(best_df) > 0 else "N/A"
            
            mape_val = best_df['MAPE'].mean() if 'MAPE' in best_df.columns else None
            r2 = round(float(mape_val), 3) if mape_val is not None and pd.notna(mape_val) else None
            
            modelos_unicos = len(modelos_usados)
        else:
            mae = 0.0
            rmse = 0.0
            mejor_modelo = "N/A"
            r2 = None
            modelos_unicos = 0
        
        # Calcular pérdidas totales (solo valores negativos en PERDIDAS_M3)
        if not balances_df.empty and 'PERDIDAS_M3' in balances_df.columns:
            perdidas_series = pd.to_numeric(balances_df['PERDIDAS_M3'], errors='coerce')
            perdidas_totales = abs(float(perdidas_series.sum()))
        else:
            perdidas_totales = 0.0
        
        # Contar válvulas monitoreadas
        valvulas_monitoreadas = len(resumen_df) if not resumen_df.empty else 0
        
        # Calcular índice promedio de pérdidas
        if not resumen_df.empty and 'INDICE_PERDIDAS_FINAL_MEAN' in resumen_df.columns:
            mean_val = resumen_df['INDICE_PERDIDAS_FINAL_MEAN'].mean()
            indice_promedio = abs(float(mean_val)) if pd.notna(mean_val) else 0.0
        else:
            indice_promedio = 0.0
        
        return KPIResponse(
            mae=mae,
            rmse=rmse,
            r2=r2,
            perdidas_totales=round(perdidas_totales, 2),
            valvulas_monitoreadas=valvulas_monitoreadas,
            indice_promedio=round(indice_promedio * 100, 2),  # Convertir a porcentaje
            mejor_modelo=mejor_modelo,
            modelos_unicos=modelos_unicos,
            usa_modelo_por_valvula=True
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener KPIs: {str(e)}"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener KPIs: {str(e)}"
        )


@router.get(
    "/loss-index-evolution",
    response_model=list[LossIndexPoint],
    summary="Evolución del índice de pérdidas",
    description="Serie temporal del índice de pérdidas (real vs predicho)"
)
def get_loss_index_evolution(
    valvula_id: Optional[str] = Query(None, description="Filtrar por válvula específica")
):
    """
    Obtiene la evolución mensual del índice de pérdidas.
    
    Combina datos reales y predichos de Tabla_Balances_Virtuales.csv
    """
    try:
        balances_df = data_loader.load_balances_virtuales()
        
        if balances_df.empty:
            return []
        
        # Filtrar por válvula si se especifica
        if valvula_id:
            balances_df = balances_df[balances_df['PUNTO'] == valvula_id]
        
        # Agrupar por periodo
        if 'PERIODO' in balances_df.columns and 'INDICE_PERDIDAS_%' in balances_df.columns:
            evolution = []
            
            for periodo in sorted(balances_df['PERIODO'].unique()):
                periodo_data = balances_df[balances_df['PERIODO'] == periodo]
                
                # Separar reales de predichos
                real_data = periodo_data[~periodo_data['ES_PRONOSTICO']]
                pred_data = periodo_data[periodo_data['ES_PRONOSTICO']]
                
                indice_real = None
                indice_predicho = None
                
                if not real_data.empty:
                    mean_val = real_data['INDICE_PERDIDAS_%'].mean()
                    indice_real = float(mean_val) if pd.notna(mean_val) else None
                
                if not pred_data.empty:
                    mean_val = pred_data['INDICE_PERDIDAS_%'].mean()
                    indice_predicho = float(mean_val) if pd.notna(mean_val) else None
                
                evolution.append(LossIndexPoint(
                    periodo=str(periodo),
                    indice_real=indice_real,
                    indice_predicho=indice_predicho
                ))
            
            return evolution
        
        return []
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener evolución: {str(e)}"
        )


@router.get(
    "/top-valves",
    response_model=list[TopValve],
    summary="Top válvulas con mayores desbalances",
    description="Ranking de válvulas ordenadas por pérdidas"
)
def get_top_valves(
    limit: int = Query(5, ge=1, le=20, description="Cantidad de válvulas a retornar")
):
    """
    Obtiene el top de válvulas con mayores desbalances.
    
    Datos de: dashboard/Top_Desbalances.csv
    """
    try:
        top_df = data_loader.load_top_desbalances()
        
        if top_df.empty:
            return []
        
        # Tomar top N (ordenar por pérdidas absolutas)
        if 'PERDIDAS_ABS' in top_df.columns:
            top_df = top_df.sort_values('PERDIDAS_ABS', ascending=False)
        
        top_n = top_df.head(limit)
        
        result = []
        for _, row in top_n.iterrows():
            perdidas = row.get('PERDIDAS_PROMEDIO_M3', 0)
            indice = row.get('INDICE_PERDIDAS_%', 0)
            entrada = row.get('ENTRADA_PROMEDIO_M3', 0)
            salida = row.get('SALIDA_PROMEDIO_M3', 0)
            periodos = row.get('NUM_PERIODOS', 0)
            
            result.append(TopValve(
                valvula=str(row['VALVULA']),
                perdidas_promedio=round(float(perdidas), 2) if pd.notna(perdidas) else 0.0,
                indice_perdidas=round(abs(float(indice)), 2) if pd.notna(indice) else 0.0,
                entrada_promedio=round(float(entrada), 2) if pd.notna(entrada) else 0.0,
                salida_promedio=round(float(salida), 2) if pd.notna(salida) else 0.0,
                num_periodos=int(periodos) if pd.notna(periodos) else 0
            ))
        
        return result
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener top válvulas: {str(e)}"
        )


@router.get(
    "/summary",
    summary="Resumen general del sistema",
    description="Vista general con todos los indicadores principales"
)
def get_dashboard_summary():
    """
    Endpoint consolidado que retorna todos los datos del dashboard en una sola llamada.
    Útil para cargar la vista inicial del dashboard de forma eficiente.
    """
    try:
        kpis = get_dashboard_kpis()
        evolution = get_loss_index_evolution()
        top_valves = get_top_valves(limit=5)
        
        return {
            "kpis": kpis,
            "loss_index_evolution": evolution,
            "top_valves": top_valves,
            "timestamp": pd.Timestamp.now().isoformat()
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener resumen: {str(e)}"
        )


@router.get(
    "/valves-status",
    summary="Estado de todas las válvulas",
    description="Lista de válvulas con su estado y métricas básicas"
)
def get_valves_status():
    """
    Retorna el estado de todas las válvulas monitoreadas.
    
    Útil para mapas, tablas de resumen, etc.
    """
    try:
        resumen_df = data_loader.load_resumen_valvulas()
        alertas_df = data_loader.load_alertas()
        
        if resumen_df.empty:
            return []
        
        # Crear mapa de alertas
        alertas_map = {}
        if not alertas_df.empty:
            for _, row in alertas_df.iterrows():
                alertas_map[row['VALVULA']] = row['NIVEL']
        
        valves_status = []
        for _, row in resumen_df.iterrows():
            valvula = str(row['VALVULA'])
            
            entrada_val = row.get('VOLUMEN_ENTRADA_FINAL_SUM', 0)
            salida_val = row.get('VOLUMEN_SALIDA_FINAL_SUM', 0)
            indice_val = row.get('INDICE_PERDIDAS_FINAL_MEAN', 0)
            
            valves_status.append({
                "valvula": valvula,
                "fecha_inicio": str(row.get('FECHA_MIN', '')),
                "fecha_fin": str(row.get('FECHA_MAX', '')),
                "volumen_entrada_total": round(float(entrada_val), 2) if pd.notna(entrada_val) else 0.0,
                "volumen_salida_total": round(float(salida_val), 2) if pd.notna(salida_val) else 0.0,
                "indice_promedio": round(abs(float(indice_val)) * 100, 2) if pd.notna(indice_val) else 0.0,
                "nivel_alerta": alertas_map.get(valvula, "NORMAL"),
                "tiene_macromedidor": bool(row.get('TIENE_MACROMEDIDOR_SUM', False))
            })
        
        return valves_status
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener estado de válvulas: {str(e)}"
        )
