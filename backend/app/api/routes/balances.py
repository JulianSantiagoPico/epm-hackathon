"""Rutas de Balances - Consulta de balances por válvula"""
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
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
        df_valvula = balances_df[balances_df['PUNTO'] == valvula_id].copy()
        
        if df_valvula.empty:
            raise HTTPException(
                status_code=404,
                detail=f"Válvula {valvula_id} no encontrada"
            )

        # MVP: Rellenar datos faltantes para VALVULA_1 para presentación
        if valvula_id == "VALVULA_1":
            # Valores por defecto para demostración (ajustados a la magnitud real ~400)
            DEFAULT_ENTRADA = 450.0
            DEFAULT_SALIDA = 125.0
            
            # Asegurar que las columnas sean numéricas
            cols = ['ENTRADA_M3', 'SALIDA_M3', 'PERDIDAS_M3', 'INDICE_PERDIDAS_%']
            for col in cols:
                if col in df_valvula.columns:
                    df_valvula[col] = pd.to_numeric(df_valvula[col], errors='coerce')

            # Rellenar Entrada y Salida
            df_valvula['ENTRADA_M3'] = df_valvula['ENTRADA_M3'].fillna(DEFAULT_ENTRADA)
            df_valvula['SALIDA_M3'] = df_valvula['SALIDA_M3'].fillna(DEFAULT_SALIDA)
            
            # Calcular Pérdidas donde falten
            df_valvula['PERDIDAS_M3'] = df_valvula['PERDIDAS_M3'].fillna(
                df_valvula['ENTRADA_M3'] - df_valvula['SALIDA_M3']
            )
            
            # Calcular Índice donde falte
            df_valvula['INDICE_PERDIDAS_%'] = df_valvula['INDICE_PERDIDAS_%'].fillna(
                (df_valvula['PERDIDAS_M3'] / df_valvula['ENTRADA_M3'] * 100)
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
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener períodos: {str(e)}"
        )


@router.post(
    "/{valvula_id}/analyze",
    summary="Analizar balances con IA",
    description="Genera un análisis de los balances usando OpenAI GPT"
)
async def analyze_balance(valvula_id: str):
    """
    Genera un análisis inteligente de los balances de la válvula.
    """
    import os
    from openai import OpenAI
    from dotenv import load_dotenv

    try:
        # Forzar recarga de variables de entorno para capturar cambios en .env sin reiniciar
        # En producción (Docker), esto podría no tener efecto si no hay .env, lo cual está bien.
        try:
            load_dotenv(override=True)
        except Exception:
            pass

        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            # Retornar error JSON explícito en lugar de lanzar excepción que podría ser malinterpretada
            return JSONResponse(
                status_code=500,
                content={"detail": "OPENAI_API_KEY no configurada en el servidor", "error_type": "ConfigurationError"}
            )

        # 1. Obtener datos de la válvula (reutilizando lógica de carga)
        balances_df = data_loader.load_balances_virtuales()
        df_valvula = balances_df[balances_df['PUNTO'] == valvula_id].copy()
        
        if df_valvula.empty:
            # Lógica de relleno para MVP si es VALVULA_1 (consistente con get_balance_by_valve)
            if valvula_id == "VALVULA_1":
                 # Valores por defecto para demostración (ajustados a la magnitud real ~400)
                DEFAULT_ENTRADA = 450.0
                DEFAULT_SALIDA = 125.0
                
                cols = ['ENTRADA_M3', 'SALIDA_M3', 'PERDIDAS_M3', 'INDICE_PERDIDAS_%']
                for col in cols:
                    if col in df_valvula.columns:
                        df_valvula[col] = pd.to_numeric(df_valvula[col], errors='coerce')

                df_valvula['ENTRADA_M3'] = df_valvula['ENTRADA_M3'].fillna(DEFAULT_ENTRADA)
                df_valvula['SALIDA_M3'] = df_valvula['SALIDA_M3'].fillna(DEFAULT_SALIDA)
                df_valvula['PERDIDAS_M3'] = df_valvula['PERDIDAS_M3'].fillna(df_valvula['ENTRADA_M3'] - df_valvula['SALIDA_M3'])
                df_valvula['INDICE_PERDIDAS_%'] = df_valvula['INDICE_PERDIDAS_%'].fillna((df_valvula['PERDIDAS_M3'] / df_valvula['ENTRADA_M3'] * 100))
            else:
                raise HTTPException(status_code=404, detail=f"Válvula {valvula_id} no encontrada")

        # Asegurar que las columnas sean numéricas para TODAS las válvulas (reales o simuladas)
        # Esto evita errores si los datos del CSV vienen como strings
        cols_kpi = ['PERDIDAS_M3', 'INDICE_PERDIDAS_%']
        for col in cols_kpi:
            if col in df_valvula.columns:
                df_valvula[col] = pd.to_numeric(df_valvula[col], errors='coerce')

        # 2. Calcular KPIs para el prompt
        total_perdidas = df_valvula['PERDIDAS_M3'].sum()
        promedio_indice = df_valvula['INDICE_PERDIDAS_%'].mean()
        
        # 3. Construir Prompt
        prompt = f"""
        Actúa como un experto en gestión de gas y pérdidas. Analiza los siguientes datos para la válvula {valvula_id}:
        
        - Total de Pérdidas Acumuladas: {total_perdidas:,.2f} m3
        - Índice de Pérdidas Promedio: {promedio_indice:.2f}%
        
        Proporciona un análisis breve (max 3 párrafos) sobre:
        1. La gravedad de la situación.
        2. Posibles causas técnicas (fugas, errores de medición, fraude).
        3. Una recomendación prioritaria para el tomador de decisiones.
        
        Usa un tono profesional y directivo.
        """

        # 4. Llamar a OpenAI
        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un asistente experto en eficiencia hidráulica."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=800,
            temperature=0.7
        )
        
        analysis = response.choices[0].message.content
        return {"analysis": analysis}

    except Exception as e:
        print(f"Error en análisis IA: {e}")
        # Retornar JSONResponse para asegurar que CORS headers se puedan adjuntar si es posible,
        # y para dar info detallada al frontend.
        return JSONResponse(
            status_code=500,
            content={"detail": str(e), "error_type": type(e).__name__}
        )
