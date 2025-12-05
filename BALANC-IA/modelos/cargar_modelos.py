"""
Script para cargar y usar modelos en producción
"""
import pickle
import joblib
import pandas as pd
import numpy as np
from prophet import Prophet
from catboost import CatBoostRegressor

def cargar_modelos(valvula):
    """
    Carga todos los modelos entrenados para una válvula

    Args:
        valvula: Nombre de la válvula (ej: 'VALVULA_1')

    Returns:
        dict: Diccionario con modelos y metadata
    """
    # Cargar metadata
    with open('modelos/metadata_modelos.pkl', 'rb') as f:
        metadata = pickle.load(f)

    if valvula not in metadata:
        raise ValueError(f"Válvula {valvula} no encontrada en modelos")

    modelos = {}
    meta_v = metadata[valvula]

    # Cargar cada modelo disponible
    for modelo_nombre in meta_v['modelos_disponibles']:
        try:
            if modelo_nombre == 'prophet':
                with open(f'modelos/{valvula}_prophet.pkl', 'rb') as f:
                    modelos['prophet'] = pickle.load(f)
            elif modelo_nombre == 'lightgbm':
                modelos['lightgbm'] = joblib.load(f'modelos/{valvula}_lightgbm.pkl')
            elif modelo_nombre == 'randomforest':
                modelos['randomforest'] = joblib.load(f'modelos/{valvula}_randomforest.pkl')
            elif modelo_nombre == 'catboost':
                # Intentar cargar .cbm primero (más eficiente)
                try:
                    modelos['catboost'] = CatBoostRegressor()
                    modelos['catboost'].load_model(f'modelos/{valvula}_catboost.cbm')
                except:
                    modelos['catboost'] = joblib.load(f'modelos/{valvula}_catboost.pkl')
            elif modelo_nombre == 'hybrid_prophet':
                with open(f'modelos/{valvula}_hybrid_prophet.pkl', 'rb') as f:
                    modelos['hybrid_prophet'] = pickle.load(f)
            elif modelo_nombre == 'hybrid_lstm':
                from tensorflow.keras.models import load_model
                modelos['hybrid_lstm'] = load_model(f'modelos/{valvula}_hybrid_lstm.h5')
        except Exception as e:
            print(f"⚠ Error cargando {modelo_nombre}: {e}")

    return {
        'modelos': modelos,
        'metadata': meta_v
    }

def predecir_entrada(valvula, features_dict, fecha=None):
    """
    Hace predicción usando el ensemble de modelos

    Args:
        valvula: Nombre de la válvula
        features_dict: Diccionario con features necesarias
        fecha: Fecha para predicción (requerida para Prophet)

    Returns:
        float: Predicción de volumen de entrada
    """
    modelos_data = cargar_modelos(valvula)
    modelos = modelos_data['modelos']
    metadata = modelos_data['metadata']

    predicciones = []
    pesos = []

    # Prophet
    if 'prophet' in modelos and fecha is not None:
        try:
            future = pd.DataFrame({'ds': [pd.to_datetime(fecha)]})
            pred = modelos['prophet'].predict(future)['yhat'].values[0]
            predicciones.append(pred)
            pesos.append(0.2)  # Peso por defecto
        except:
            pass

    # Modelos basados en features
    for modelo_nombre in ['lightgbm', 'randomforest', 'catboost']:
        if modelo_nombre in modelos:
            try:
                feat_cols = metadata['features_por_modelo'].get(modelo_nombre, [])
                if feat_cols:
                    X = pd.DataFrame([features_dict])[feat_cols].fillna(0)
                    pred = modelos[modelo_nombre].predict(X)[0]
                    predicciones.append(pred)
                    # Peso basado en modelo (ajustar según métricas)
                    pesos_default = {'lightgbm': 0.25, 'randomforest': 0.25, 'catboost': 0.3}
                    pesos.append(pesos_default.get(modelo_nombre, 0.2))
            except Exception as e:
                print(f"⚠ Error en predicción {modelo_nombre}: {e}")

    # Ensemble
    if len(predicciones) > 0:
        pesos = np.array(pesos) / np.sum(pesos)
        return np.average(predicciones, weights=pesos)
    else:
        return None

# Ejemplo de uso:
# modelos_data = cargar_modelos('VALVULA_1')
# pred = predecir_entrada('VALVULA_1', {'PRESION_FINAL': 10.5, 'TEMPERATURA_FINAL': 25.0, ...}, fecha='2025-08-01')
