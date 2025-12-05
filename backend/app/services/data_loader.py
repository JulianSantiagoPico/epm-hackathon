"""Servicio para cargar y procesar CSVs de BALANC-IA"""
import pandas as pd
import numpy as np
from pathlib import Path
from typing import Optional, Dict, List
from app.config import settings


class DataLoader:
    """
    Clase para cargar todos los CSVs generados por el notebook de ML.
    Centraliza el acceso a datos y maneja errores de lectura.
    """
    
    def __init__(self):
        self.data_path = settings.DATA_PATH
        self._cache: Dict[str, pd.DataFrame] = {}
    
    # ==================== MÉTODOS PRINCIPALES ====================
    
    def load_balances_virtuales(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga tabla de balances virtuales (reales + predichos)
        Archivo: Tabla_Balances_Virtuales.csv
        
        Columnas: PUNTO, PERIODO, AÑO, MES, FECHA, ENTRADA_m3, SALIDA_m3, 
                  PERDIDAS_m3, INDICE_PERDIDAS_%, ES_PRONOSTICO
        """
        cache_key = "balances_virtuales"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("Tabla_Balances_Virtuales.csv")
        
        # Limpiar nombres de columnas
        df.columns = df.columns.str.strip().str.upper()
        
        # Convertir tipos
        if 'FECHA' in df.columns:
            df['FECHA'] = pd.to_datetime(df['FECHA'], errors='coerce')
        
        # Convertir columnas numéricas (están con comas)
        numeric_cols = ['ENTRADA_M3', 'SALIDA_M3', 'PERDIDAS_M3', 'INDICE_PERDIDAS_%']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = df[col].astype(str).str.replace(',', '.').astype(float)
        
        self._cache[cache_key] = df
        return df.copy()
    
    def load_pronosticos(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga pronósticos de modelos (Prophet, LGBM, RF, CatBoost, LSTM, Hybrid)
        Archivo: Pronosticos.csv
        
        Columnas: VALVULA, PERIODO, FECHA, PRED_ENTRADA_*, PRED_SALIDA, 
                  PRED_PERDIDAS, PRED_INDICE_PERDIDAS
        """
        cache_key = "pronosticos"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("Pronosticos.csv")
        df.columns = df.columns.str.strip().str.upper()
        
        # Convertir fecha
        if 'FECHA' in df.columns:
            df['FECHA'] = pd.to_datetime(df['FECHA'], errors='coerce')
        
        # Convertir columnas numéricas
        numeric_cols = [col for col in df.columns if 'PRED_' in col or col == 'PERIODO']
        for col in numeric_cols:
            if col in df.columns and col != 'PERIODO':
                df[col] = df[col].astype(str).str.replace(',', '.').astype(float)
        
        self._cache[cache_key] = df
        return df.copy()
    
    def load_metrics(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga métricas de performance de modelos
        Archivo: Metrics.csv
        
        Columnas: VALVULA, MODELO, MAE, RMSE, MAPE, MASE, N_TEST
        """
        cache_key = "metrics"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("Metrics.csv")
        df.columns = df.columns.str.strip().str.upper()
        
        # Convertir métricas a float
        metric_cols = ['MAE', 'RMSE', 'MAPE', 'MASE']
        for col in metric_cols:
            if col in df.columns:
                df[col] = df[col].astype(str).str.replace(',', '.').astype(float)
        
        self._cache[cache_key] = df
        return df.copy()
    
    def load_resumen_valvulas(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga resumen agregado por válvula
        Archivo: Resumen_Valvulas.csv
        
        Columnas: VALVULA, FECHA_min, FECHA_max, VOLUMEN_ENTRADA_FINAL_sum,
                  VOLUMEN_SALIDA_FINAL_sum, INDICE_PERDIDAS_FINAL_mean, etc.
        """
        cache_key = "resumen_valvulas"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("Resumen_Valvulas.csv")
        df.columns = df.columns.str.strip().str.upper()
        
        # Convertir fechas
        for col in ['FECHA_MIN', 'FECHA_MAX']:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')
        
        # Convertir columnas numéricas
        numeric_cols = [col for col in df.columns if any(x in col for x in ['VOLUMEN', 'INDICE', 'SUM', 'MEAN'])]
        for col in numeric_cols:
            if col in df.columns:
                df[col] = df[col].astype(str).str.replace(',', '.').astype(float)
        
        self._cache[cache_key] = df
        return df.copy()
    
    # ==================== DASHBOARD DATA ====================
    
    def load_alertas(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga alertas de puntos críticos
        Archivo: dashboard/Alertas_Puntos.csv
        
        Columnas: VALVULA, NIVEL, MENSAJES, INDICE_PERDIDAS_%, ENTRADA_PROMEDIO
        """
        cache_key = "alertas"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("dashboard/Alertas_Puntos.csv")
        df.columns = df.columns.str.strip().str.upper()
        
        # Convertir columnas numéricas
        numeric_cols = ['INDICE_PERDIDAS_%', 'ENTRADA_PROMEDIO']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = df[col].astype(str).str.replace(',', '.').astype(float)
        
        self._cache[cache_key] = df
        return df.copy()
    
    def load_top_desbalances(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga top de desbalances por válvula
        Archivo: dashboard/Top_Desbalances.csv
        
        Columnas: VALVULA, PERDIDAS_PROMEDIO_m3, INDICE_PERDIDAS_%, 
                  ENTRADA_PROMEDIO_m3, SALIDA_PROMEDIO_m3, NUM_PERIODOS, PERDIDAS_ABS
        """
        cache_key = "top_desbalances"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("dashboard/Top_Desbalances.csv")
        df.columns = df.columns.str.strip().str.upper()
        
        # Convertir columnas numéricas
        numeric_cols = [col for col in df.columns if col != 'VALVULA' and col != 'NUM_PERIODOS']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = df[col].astype(str).str.replace(',', '.').astype(float)
        
        self._cache[cache_key] = df
        return df.copy()
    
    def load_top_indice_perdidas(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga top 10 de índices de pérdidas
        Archivo: dashboard/Top10_Indice_Perdidas.csv
        """
        cache_key = "top_indice"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("dashboard/Top10_Indice_Perdidas.csv")
        df.columns = df.columns.str.strip().str.upper()
        
        # Convertir columnas numéricas
        for col in df.columns:
            if col != 'VALVULA' and col != 'PUNTO':
                df[col] = pd.to_numeric(
                    df[col].astype(str).str.replace(',', '.'), 
                    errors='coerce'
                )
        
        self._cache[cache_key] = df
        return df.copy()
    
    # ==================== EDA DATA ====================
    
    def load_correlations(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga matriz de correlación
        Archivo: eda/Matriz_Correlacion.csv
        
        Matriz NxN con correlaciones entre variables
        """
        cache_key = "correlations"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("eda/Matriz_Correlacion.csv", index_col=0)
        
        # Convertir todo a float
        for col in df.columns:
            df[col] = df[col].astype(str).str.replace(',', '.').astype(float)
        
        self._cache[cache_key] = df
        return df.copy()
    
    def load_estadisticas_descriptivas(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga estadísticas descriptivas
        Archivo: eda/Estadisticas_Descriptivas.csv
        """
        cache_key = "estadisticas"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("eda/Estadisticas_Descriptivas.csv", index_col=0)
        
        # Convertir a float
        for col in df.columns:
            df[col] = pd.to_numeric(
                df[col].astype(str).str.replace(',', '.'), 
                errors='coerce'
            )
        
        self._cache[cache_key] = df
        return df.copy()
    
    # ==================== UTILITY METHODS ====================
    
    def _read_csv(self, relative_path: str, **kwargs) -> pd.DataFrame:
        """
        Lee un CSV con manejo de errores y múltiples encodings
        
        Args:
            relative_path: Ruta relativa desde DATA_PATH
            **kwargs: Argumentos adicionales para pd.read_csv
        """
        file_path = self.data_path / relative_path
        
        if not file_path.exists():
            raise FileNotFoundError(
                f"Archivo no encontrado: {file_path}\n"
                f"Ruta esperada: {relative_path}"
            )
        
        # Lista de encodings a intentar
        encodings = ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252', 'windows-1252']
        
        # Configuración por defecto
        default_kwargs = {
            'sep': ';',
            'on_bad_lines': 'skip'
        }
        default_kwargs.update(kwargs)
        
        # Intentar con cada encoding
        last_error = None
        for encoding in encodings:
            try:
                default_kwargs['encoding'] = encoding
                df = pd.read_csv(file_path, **default_kwargs)
                return df
            except UnicodeDecodeError as e:
                last_error = e
                continue
            except Exception as e:
                # Si es otro tipo de error, lanzarlo inmediatamente
                raise RuntimeError(
                    f"Error al leer {relative_path}: {str(e)}"
                )
        
        # Si ningún encoding funcionó
        raise RuntimeError(
            f"Error al leer {relative_path}: No se pudo decodificar con ningún encoding. "
            f"Último error: {str(last_error)}"
        )
    
    def clear_cache(self):
        """Limpia el caché de DataFrames"""
        self._cache.clear()
    
    def get_available_valvulas(self) -> List[str]:
        """Obtiene lista de válvulas disponibles"""
        try:
            df = self.load_balances_virtuales()
            return sorted(df['PUNTO'].unique().tolist())
        except Exception:
            # Fallback
            return ['VALVULA_1', 'VALVULA_2', 'VALVULA_3', 'VALVULA_4', 'VALVULA_5']
    
    def get_available_periodos(self, valvula: Optional[str] = None) -> List[str]:
        """Obtiene lista de períodos disponibles (opcionalmente filtrado por válvula)"""
        try:
            df = self.load_balances_virtuales()
            
            if valvula:
                df = df[df['PUNTO'] == valvula]
            
            return sorted(df['PERIODO'].astype(str).unique().tolist())
        
        except Exception:
            return []
    
    def load_analisis_confiabilidad(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga análisis de confiabilidad de modelos por válvula
        Archivo: Analisis_Confiabilidad.csv
        
        Columnas: VALVULA, SCORE, NIVEL, MEJOR_MODELO, MAE, MAPE
        """
        cache_key = "analisis_confiabilidad"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("Analisis_Confiabilidad.csv")
        df.columns = df.columns.str.strip().str.upper()
        
        # Convertir columnas numéricas (comas a puntos)
        numeric_cols = ['SCORE', 'MAE', 'MAPE']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = df[col].astype(str).str.replace(',', '.').astype(float)
        
        self._cache[cache_key] = df
        return df.copy()
    
    def load_benchmark_historico(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga benchmark de histórico vs pronóstico
        Archivo: Benchmark_Historico_vs_Pronostico.csv
        
        Columnas: VALVULA, ENTRADA_HIST, ENTRADA_PRED, SALIDA_HIST, SALIDA_PRED,
                  PERDIDAS_HIST, PERDIDAS_PRED, INDICE_HIST, INDICE_PRED,
                  DIF_ENTRADA_%, DIF_SALIDA_%, DIF_INDICE_%
        """
        cache_key = "benchmark_historico"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("Benchmark_Historico_vs_Pronostico.csv")
        df.columns = df.columns.str.strip().str.upper()
        
        # Convertir todas las columnas numéricas
        numeric_cols = [col for col in df.columns if col != 'VALVULA']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = df[col].astype(str).str.replace(',', '.').astype(float)
        
        self._cache[cache_key] = df
        return df.copy()
    
    def load_resumen_pronostico_valvulas(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga resumen agregado de pronósticos por válvula
        Archivo: Resumen_Pronostico_Valvulas.csv
        
        Columnas: VALVULA, NUM_PERIODOS, VOLUMEN_ENTRADA_FINAL_sum,
                  VOLUMEN_ENTRADA_FINAL_mean, VOLUMEN_SALIDA_FINAL_sum,
                  VOLUMEN_SALIDA_FINAL_mean, PERDIDAS_FINAL_sum,
                  PERDIDAS_FINAL_mean, INDICE_PERDIDAS_FINAL_mean
        """
        cache_key = "resumen_pronostico_valvulas"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("Resumen_Pronostico_Valvulas.csv")
        df.columns = df.columns.str.strip().str.upper()
        
        # Convertir columnas numéricas
        numeric_cols = [col for col in df.columns if col != 'VALVULA']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = df[col].astype(str).str.replace(',', '.').astype(float)
        
        self._cache[cache_key] = df
        return df.copy()
    
    def load_reporte_metricas_performance(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga reporte completo de métricas de performance
        Archivo: Reporte_Metricas_Performance.csv
        
        Columnas: TIPO, VALVULA, METRICA, VALOR
        TIPO puede ser: VALIDACION_MODELO, BENCHMARK_HISTORICO
        """
        cache_key = "reporte_metricas_performance"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("Reporte_Metricas_Performance.csv")
        df.columns = df.columns.str.strip().str.upper()
        
        # Convertir columna VALOR (puede tener comas)
        if 'VALOR' in df.columns:
            df['VALOR'] = df['VALOR'].astype(str).str.replace(',', '.').astype(float)
        
        self._cache[cache_key] = df
        return df.copy()
    
    def load_predicciones_con_balance(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga predicciones con balance
        Archivo: Predicciones_Con_Balance.csv
        
        Columnas: VALVULA, PERIODO, FECHA, VOLUMEN_ENTRADA_FINAL, INDICE_PERDIDAS_FINAL,
                  PRED_ENTRADA, PRED_SALIDA, PRED_PERDIDAS, PRED_INDICE_PERDIDAS, etc.
        """
        cache_key = "predicciones_con_balance"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("Predicciones_Con_Balance.csv")
        df.columns = df.columns.str.strip().str.upper()
        
        # Convertir fecha
        if 'FECHA' in df.columns:
            df['FECHA'] = pd.to_datetime(df['FECHA'], errors='coerce')
        
        # Convertir columnas numéricas
        numeric_cols = [
            'VOLUMEN_ENTRADA_FINAL', 'VOLUMEN_SALIDA_FINAL', 'PERDIDAS_FINAL',
            'INDICE_PERDIDAS_FINAL', 'PRED_ENTRADA', 'PRED_SALIDA', 
            'PRED_PERDIDAS', 'PRED_INDICE_PERDIDAS'
        ]
        for col in numeric_cols:
            if col in df.columns:
                df[col] = df[col].astype(str).str.replace(',', '.').astype(float)
        
        self._cache[cache_key] = df
        return df.copy()
    
    def load_dataset_maestro(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga dataset maestro completo de balances
        Archivo: Dataset_Maestro_Balances.csv
        
        Contiene todos los datos históricos y futuros con todas las variables
        Columnas: VALVULA, PERIODO, AÑO, MES, FECHA, VOLUMEN_ENTRADA_FINAL,
                  VOLUMEN_SALIDA_FINAL, PERDIDAS_FINAL, INDICE_PERDIDAS_FINAL,
                  PRESION_FINAL, TEMPERATURA_FINAL, KPT_FINAL, NUM_USUARIOS, etc.
        """
        cache_key = "dataset_maestro"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("Dataset_Maestro_Balances.csv")
        df.columns = df.columns.str.strip().str.upper()
        
        # Convertir fecha
        if 'FECHA' in df.columns:
            df['FECHA'] = pd.to_datetime(df['FECHA'], errors='coerce')
        
        # Convertir columnas numéricas
        numeric_cols = [
            'VOLUMEN_ENTRADA_FINAL', 'VOLUMEN_SALIDA_FINAL', 'PERDIDAS_FINAL',
            'INDICE_PERDIDAS_FINAL', 'PRESION_FINAL', 'TEMPERATURA_FINAL',
            'KPT_FINAL', 'NUM_USUARIOS', 'VOLUMEN_ENTRADA_MACRO', 
            'VOLUMEN_SALIDA_USUARIOS', 'PRESION_MACRO', 'TEMPERATURA_MACRO', 'KPT_MACRO'
        ]
        for col in numeric_cols:
            if col in df.columns:
                df[col] = df[col].astype(str).str.replace(',', '.').astype(float)
        
        self._cache[cache_key] = df
        return df.copy()
    
    def load_dataset_train(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga dataset de entrenamiento
        Archivo: Dataset_Train.csv
        
        Contiene datos históricos usados para entrenar los modelos
        """
        cache_key = "dataset_train"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("Dataset_Train.csv")
        df.columns = df.columns.str.strip().str.upper()
        
        # Convertir fecha
        if 'FECHA' in df.columns:
            df['FECHA'] = pd.to_datetime(df['FECHA'], errors='coerce')
        
        # Convertir columnas numéricas
        numeric_cols = [
            'VOLUMEN_ENTRADA_FINAL', 'VOLUMEN_SALIDA_FINAL', 'PERDIDAS_FINAL',
            'INDICE_PERDIDAS_FINAL', 'PRESION_FINAL', 'TEMPERATURA_FINAL',
            'KPT_FINAL', 'NUM_USUARIOS', 'VOLUMEN_ENTRADA_MACRO', 
            'VOLUMEN_SALIDA_USUARIOS', 'PRESION_MACRO', 'TEMPERATURA_MACRO', 'KPT_MACRO'
        ]
        for col in numeric_cols:
            if col in df.columns:
                df[col] = df[col].astype(str).str.replace(',', '.').astype(float)
        
        self._cache[cache_key] = df
        return df.copy()
    
    def load_resumen_analisis_modelos(self, use_cache: bool = True) -> pd.DataFrame:
        """
        Carga resumen de análisis de modelos (métricas agregadas)
        Archivo: Resumen_Analisis_Modelos.csv
        
        Contiene estadísticas descriptivas (count, mean, std, min, max) por modelo
        """
        cache_key = "resumen_analisis_modelos"
        
        if use_cache and cache_key in self._cache:
            return self._cache[cache_key].copy()
        
        df = self._read_csv("Resumen_Analisis_Modelos.csv")
        df.columns = df.columns.str.strip().str.upper()
        
        # Convertir todas las columnas numéricas
        for col in df.columns:
            if col not in ['MODELO', '']:
                df[col] = df[col].astype(str).str.replace(',', '.').astype(float)
        
        self._cache[cache_key] = df
        return df.copy()


# Instancia global del DataLoader
data_loader = DataLoader()
