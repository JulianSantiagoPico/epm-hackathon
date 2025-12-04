"""Rutas de Balances - Consulta de balances por válvula"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import pandas as pd
from app.services.data_loader import data_loader
from app.schemas.responses import (
    BalanceResponse,
    BalanceData,
    BalanceKPIs,
    ValvulasList
)

router = APIRouter()


@router.get(
    "/{valvula_id}",
    response_model=BalanceResponse,
    summary="Obtener balances por válvula",
    description="Retorna los balances mensuales (reales + predichos) de una válvula específica"
)
def get_balance_by_valve(
    valvula_id: str,
    periodo_inicio: Optional[str] = Query(None, description="Período inicio (formato: YYYYMM)"),
    periodo_fin: Optional[str] = Query(None, description="Período fin (formato: YYYYMM)")
):
    """
    Obtiene balances mensuales de una válvula específica.
    
    Args:
        valvula_id: ID de la válvula (ej: VALVULA_1)
        periodo_inicio: Período inicial opcional
        periodo_fin: Período final opcional
    """
    try:
        balances_df = data_loader.load_balances_virtuales()
        
        if balances_df.empty:
            raise HTTPException(status_code=404, detail="No hay datos de balances disponibles")
        
        # Filtrar por válvula
        df_valvula = balances_df[balances_df['PUNTO'] == valvula_id]
        
        if df_valvula.empty:
            raise HTTPException(
                status_code=404,
                detail=f"Válvula {valvula_id} no encontrada"
            )
        
        # Filtrar por rango de períodos
        if periodo_inicio:
            df_valvula = df_valvula[df_valvula['PERIODO'].astype(str) >= periodo_inicio]
        if periodo_fin:
            df_valvula = df_valvula[df_valvula['PERIODO'].astype(str) <= periodo_fin]
        
        # Calcular KPIs
        indice_series = pd.to_numeric(df_valvula['INDICE_PERDIDAS_%'], errors='coerce')
        perdidas_series = pd.to_numeric(df_valvula['PERDIDAS_M3'], errors='coerce')
        
        indice_mean = indice_series.mean()
        perdidas_sum = perdidas_series.sum()
        
        kpis = BalanceKPIs(
            indice_promedio=round(abs(float(indice_mean)), 2) if pd.notna(indice_mean) else 0.0,
            total_perdidas=round(abs(float(perdidas_sum)), 2) if pd.notna(perdidas_sum) else 0.0,
            meses_analizados=len(df_valvula)
        )
        
        # Preparar balances mensuales
        balances = []
        for _, row in df_valvula.iterrows():
            balances.append(BalanceData(
                periodo=str(row['PERIODO']),
                fecha=pd.to_datetime(row['FECHA']) if pd.notna(row['FECHA']) else None,
                entrada=float(row['ENTRADA_M3']) if pd.notna(row['ENTRADA_M3']) else None,
                salida=float(row['SALIDA_M3']) if pd.notna(row['SALIDA_M3']) else None,
                perdidas=float(row['PERDIDAS_M3']) if pd.notna(row['PERDIDAS_M3']) else None,
                indice=float(row['INDICE_PERDIDAS_%']) if pd.notna(row['INDICE_PERDIDAS_%']) else None,
                es_pronostico=bool(row.get('ES_PRONOSTICO', False))
            ))
        
        return BalanceResponse(
            valvula_id=valvula_id,
            kpis=kpis,
            balances=balances
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener balances: {str(e)}"
        )


@router.get(
    "/",
    response_model=ValvulasList,
    summary="Listar todas las válvulas",
    description="Obtiene lista de válvulas disponibles en el sistema"
)
def list_valves():
    """
    Lista todas las válvulas disponibles.
    """
    try:
        valvulas = data_loader.get_available_valvulas()
        return ValvulasList(valvulas=valvulas)
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al listar válvulas: {str(e)}"
        )


@router.get(
    "/{valvula_id}/periodos",
    response_model=dict,
    summary="Obtener períodos disponibles por válvula",
    description="Lista los períodos con datos para una válvula específica"
)
def get_valve_periods(valvula_id: str):
    """
    Obtiene los períodos disponibles para una válvula.
    """
    try:
        periodos = data_loader.get_available_periodos(valvula=valvula_id)
        
        if not periodos:
            raise HTTPException(
                status_code=404,
                detail=f"No hay períodos disponibles para {valvula_id}"
            )
        
        return {
            "valvula": valvula_id,
            "periodos": periodos,
            "total": len(periodos),
            "primer_periodo": periodos[0] if periodos else None,
            "ultimo_periodo": periodos[-1] if periodos else None
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener períodos: {str(e)}"
        )
