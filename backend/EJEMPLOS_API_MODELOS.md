# Ejemplos de uso - API de Modelos

Documentación con ejemplos de cómo usar los nuevos endpoints del módulo de modelos.

## 🚀 Endpoints Disponibles

### 1. Listar modelos disponibles

```bash
GET http://localhost:8000/api/models/available
```

**Respuesta:**

```json
{
  "models": ["CatBoost", "LightGBM", "RandomForest"],
  "total": 3
}
```

---

### 2. Obtener métricas de todos los modelos

```bash
GET http://localhost:8000/api/models/metrics
```

**Respuesta:**

```json
{
  "models": [
    {
      "id": "catboost",
      "name": "CatBoost",
      "valvula": null,
      "metrics": {
        "mae": 1567.08,
        "rmse": 1776.49,
        "mape": 14.18,
        "mase": 1.94,
        "r2": null,
        "n_test": 2
      }
    },
    {
      "id": "lightgbm",
      "name": "LightGBM",
      "valvula": null,
      "metrics": {
        "mae": 2659.22,
        "rmse": 2767.18,
        "mape": 19.02,
        "mase": 3.07,
        "r2": null,
        "n_test": 2
      }
    }
  ]
}
```

**Filtrar por válvula:**

```bash
GET http://localhost:8000/api/models/metrics?valvula_id=VALVULA_1
```

---

### 3. Comparar modelos por métrica

```bash
GET http://localhost:8000/api/models/comparison?metric=mae
```

**Respuesta:**

```json
{
  "metric": "mae",
  "models": [
    {
      "modelo": "CatBoost",
      "value": 1567.08,
      "n_valves": 4
    },
    {
      "modelo": "RandomForest",
      "value": 1597.86,
      "n_valves": 4
    }
  ]
}
```

**Métricas disponibles:** `mae`, `rmse`, `mape`, `mase`

---

### 4. Obtener mejor modelo

```bash
GET http://localhost:8000/api/models/best?metric=mae
```

**Respuesta:**

```json
{
  "modelo": "CatBoost",
  "valvula": "VALVULA_1",
  "metric": "mae",
  "value": 71.4075,
  "mae": 71.4075,
  "rmse": 94.7972,
  "mape": 15.2857
}
```

---

### 5. Mejor modelo por válvula

```bash
GET http://localhost:8000/api/models/best-by-valve?metric=mae
```

**Respuesta:**

```json
{
  "valves": [
    {
      "valvula": "VALVULA_1",
      "mejor_modelo": "CatBoost",
      "mae": 71.4075,
      "rmse": 94.7972,
      "mape": 15.2857,
      "mase": 0.9774,
      "r2": null
    },
    {
      "valvula": "VALVULA_3",
      "mejor_modelo": "RandomForest",
      "mae": 1090.9095,
      "rmse": 1125.0696,
      "mape": 3.8655,
      "mase": 1.9224,
      "r2": null
    }
  ],
  "total_valvulas": 5
}
```

---

### 6. Datos de scatter plot (Real vs Predicho)

```bash
GET http://localhost:8000/api/models/predictions-scatter?modelo=LightGBM
```

**Con válvula específica:**

```bash
GET http://localhost:8000/api/models/predictions-scatter?modelo=CatBoost&valvula_id=VALVULA_1
```

**Respuesta:**

```json
{
  "modelo": "LightGBM",
  "valvula": null,
  "data": [
    {
      "id": 1,
      "real": -0.13,
      "predicted": -0.15,
      "periodo": "202409"
    },
    {
      "id": 2,
      "real": -0.04,
      "predicted": -0.02,
      "periodo": "202410"
    }
  ],
  "total_puntos": 12,
  "error_promedio": 0.28,
  "correlacion": 0.94
}
```

**Modelos válidos:** `LightGBM`, `CatBoost`, `RandomForest`

---

### 7. Detalles técnicos del modelo

```bash
GET http://localhost:8000/api/models/lightgbm/details
```

**Con válvula específica:**

```bash
GET http://localhost:8000/api/models/catboost/details?valvula_id=VALVULA_1
```

**Respuesta:**

```json
{
  "id": "lightgbm",
  "name": "LightGBM",
  "version": "LightGBM 4.1.0",
  "framework": "Scikit-Learn 1.3.2",
  "trained_on": "2025-12-01",
  "data_points": 15240,
  "hyperparameters": {
    "n_estimators": 100,
    "max_depth": 6,
    "learning_rate": 0.1,
    "num_leaves": 31,
    "subsample": 0.8,
    "colsample_bytree": 0.8
  },
  "features": [
    {
      "name": "volumen_corregido",
      "importance": 0.35
    },
    {
      "name": "presion",
      "importance": 0.22
    },
    {
      "name": "temperatura",
      "importance": 0.18
    }
  ],
  "metrics": {
    "mae": 2659.22,
    "rmse": 2767.18,
    "mape": 19.02,
    "mase": 3.07,
    "r2": null,
    "n_test": 2
  }
}
```

**IDs de modelos válidos:** `lightgbm`, `catboost`, `randomforest`, `xgboost`, `prophet`

---

## 🧪 Probar con curl (PowerShell)

```powershell
# Listar modelos
Invoke-WebRequest -Uri "http://localhost:8000/api/models/available" | Select-Object -ExpandProperty Content

# Métricas de modelos
Invoke-WebRequest -Uri "http://localhost:8000/api/models/metrics" | Select-Object -ExpandProperty Content

# Scatter plot
Invoke-WebRequest -Uri "http://localhost:8000/api/models/predictions-scatter?modelo=LightGBM" | Select-Object -ExpandProperty Content

# Detalles del modelo
Invoke-WebRequest -Uri "http://localhost:8000/api/models/lightgbm/details" | Select-Object -ExpandProperty Content
```

---

## 📊 Integración con Frontend

```javascript
import { modelsAPI } from "../services/api";

// Obtener métricas
const metrics = await modelsAPI.getMetrics();

// Obtener datos de scatter
const scatterData = await modelsAPI.getPredictionsScatter("LightGBM");

// Obtener detalles del modelo
const details = await modelsAPI.getModelDetails("lightgbm");

// Obtener modelos disponibles
const available = await modelsAPI.getAvailable();
```

---

## 🔍 Documentación interactiva

Una vez iniciado el servidor, visita:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Ahí encontrarás todos los endpoints con ejemplos interactivos para probarlos directamente.
