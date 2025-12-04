# API Backend - EPM Gas Balances

API REST completa para el sistema de balances virtuales de gas natural de EPM.

## 🚀 Inicio Rápido

### Instalación

```bash
cd backend
pip install -r requirements.txt
```

### Ejecución

```bash
# Modo desarrollo
uvicorn app.main:app --reload --port 8000

# O usar el script
.\start.ps1
```

### Documentación Interactiva

Una vez iniciado el servidor:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 📚 Endpoints Disponibles

### 🏠 Health Check

#### `GET /`

Verificación básica de estado del servidor.

**Respuesta:**

```json
{
  "status": "online",
  "message": "EPM Gas Balances API is running",
  "version": "1.0.0"
}
```

#### `GET /health`

Verificación detallada con información de datos.

**Respuesta:**

```json
{
  "status": "healthy",
  "data_path_exists": true,
  "data_path": "C:/path/to/BALANC-IA",
  "valvulas_disponibles": 5
}
```

---

### 📊 Dashboard (`/api/dashboard`)

#### `GET /api/dashboard/kpis`

Obtiene los KPIs principales del sistema.

> 📊 **Nota**: Las métricas `mae` y `rmse` son promedios de los mejores modelos de cada válvula, ya que cada válvula utiliza un modelo optimizado diferente.

**Respuesta:**

```json
{
  "mae": 106.214,
  "rmse": 112.32,
  "r2": 23.824,
  "perdidas_totales": 9607.5,
  "valvulas_monitoreadas": 5,
  "indice_promedio": 9.2,
  "mejor_modelo": "LightGBM",
  "modelos_unicos": 3,
  "usa_modelo_por_valvula": true
}
```

**Campos nuevos:**

- `modelos_unicos`: Cantidad de modelos diferentes utilizados en el sistema
- `usa_modelo_por_valvula`: Indica que cada válvula tiene su propio modelo optimizado
- `mejor_modelo`: Modelo más común entre los mejores de cada válvula

#### `GET /api/dashboard/loss-index-evolution?valvula_id=VALVULA_1`

Evolución temporal del índice de pérdidas.

**Parámetros query:**

- `valvula_id` (opcional): Filtrar por válvula específica

**Respuesta:**

```json
[
  {
    "periodo": "202407",
    "indice_real": -15.3,
    "indice_predicho": null
  },
  {
    "periodo": "202408",
    "indice_real": -12.8,
    "indice_predicho": -13.1
  }
]
```

#### `GET /api/dashboard/top-valves?limit=5`

Top válvulas con mayores desbalances.

**Parámetros query:**

- `limit` (opcional, default=5): Cantidad de válvulas

**Respuesta:**

```json
[
  {
    "valvula": "VALVULA_2",
    "perdidas_promedio": 470.92,
    "indice_perdidas": 21.49,
    "entrada_promedio": 2088.54,
    "salida_promedio": 2559.47,
    "num_periodos": 11
  }
]
```

#### `GET /api/dashboard/summary`

Resumen completo del dashboard (todos los datos en una llamada).

**Respuesta:**

```json
{
  "kpis": {
    /* objeto KPIResponse */
  },
  "loss_index_evolution": [
    /* array */
  ],
  "top_valves": [
    /* array */
  ],
  "timestamp": "2025-12-04T15:30:00"
}
```

#### `GET /api/dashboard/valves-status`

Estado de todas las válvulas monitoreadas.

**Respuesta:**

```json
[
  {
    "valvula": "VALVULA_1",
    "fecha_inicio": "2024-07-01",
    "fecha_fin": "2025-11-01",
    "volumen_entrada_total": 2787.62,
    "volumen_salida_total": 6977.91,
    "indice_promedio": 4.55,
    "nivel_alerta": "ALTO",
    "tiene_macromedidor": true
  }
]
```

---

### ⚖️ Balances (`/api/balances`)

#### `GET /api/balances/{valvula_id}`

Obtiene balances mensuales de una válvula.

**Path params:**

- `valvula_id`: ID de la válvula (ej: VALVULA_1)

**Query params:**

- `periodo_inicio` (opcional): Formato YYYYMM (ej: 202407)
- `periodo_fin` (opcional): Formato YYYYMM

**Respuesta:**

```json
{
  "valvula_id": "VALVULA_1",
  "kpis": {
    "indice_promedio": 4.55,
    "total_perdidas": 176.15,
    "meses_analizados": 17
  },
  "balances": [
    {
      "periodo": "202407",
      "fecha": "2024-07-01T00:00:00",
      "entrada": 66.5,
      "salida": null,
      "perdidas": null,
      "indice": null,
      "es_pronostico": false
    }
  ]
}
```

#### `GET /api/balances/`

Lista todas las válvulas disponibles.

**Respuesta:**

```json
{
  "valvulas": ["VALVULA_1", "VALVULA_2", "VALVULA_3", "VALVULA_4", "VALVULA_5"]
}
```

#### `GET /api/balances/{valvula_id}/periodos`

Obtiene períodos disponibles para una válvula.

**Respuesta:**

```json
{
  "valvula": "VALVULA_1",
  "periodos": ["202407", "202408", "..."],
  "total": 17,
  "primer_periodo": "202407",
  "ultimo_periodo": "202511"
}
```

---

### 🤖 Modelos (`/api/models`)

#### `GET /api/models/metrics?valvula_id=VALVULA_1`

Métricas de todos los modelos ML.

**Query params:**

- `valvula_id` (opcional): Filtrar por válvula

**Respuesta:**

```json
{
  "models": [
    {
      "id": "lightgbm",
      "name": "LightGBM",
      "valvula": null,
      "metrics": {
        "mae": 106.214,
        "rmse": 112.32,
        "mape": 23.824,
        "mase": 1.454,
        "r2": null,
        "n_test": 2
      }
    }
  ]
}
```

#### `GET /api/models/comparison?metric=mae`

Comparación de modelos por métrica.

**Query params:**

- `metric` (default=mae): mae, rmse, mape
- `valvula_id` (opcional): Filtrar por válvula

**Respuesta:**

```json
{
  "metric": "mae",
  "models": [
    {
      "modelo": "LightGBM",
      "value": 106.214,
      "n_valves": 5
    }
  ]
}
```

#### `GET /api/models/best?metric=mae`

Obtiene el mejor modelo según la métrica (global).

**Respuesta:**

```json
{
  "modelo": "LightGBM",
  "valvula": "VALVULA_1",
  "metric": "mae",
  "value": 106.214,
  "mae": 106.214,
  "rmse": 112.32,
  "mape": 23.824
}
```

#### `GET /api/models/best-by-valve?metric=mae` ⭐ NUEVO

**Obtiene el mejor modelo para cada válvula.**

> 🎯 **Importante**: Debido a la alta variabilidad y poca cantidad de datos, cada válvula utiliza un modelo diferente optimizado específicamente para sus características. Este endpoint refleja esa realidad mostrando cuál es el mejor modelo para cada válvula.

**Query params:**

- `metric` (default=mae): mae, rmse, mape

**Respuesta:**

```json
{
  "valves": [
    {
      "valvula": "VALVULA_1",
      "mejor_modelo": "LightGBM",
      "mae": 106.214,
      "rmse": 112.32,
      "mape": 23.824,
      "mase": 1.454,
      "r2": null
    },
    {
      "valvula": "VALVULA_2",
      "mejor_modelo": "CatBoost",
      "mae": 98.543,
      "rmse": 105.21,
      "mape": 19.345,
      "mase": 1.234,
      "r2": null
    },
    {
      "valvula": "VALVULA_3",
      "mejor_modelo": "XGBoost",
      "mae": 112.876,
      "rmse": 118.94,
      "mape": 26.112,
      "mase": 1.678,
      "r2": null
    }
  ],
  "total_valvulas": 3
}
```

**Casos de uso:**

- Visualizar qué modelo usa cada válvula
- Comparar la performance entre válvulas
- Documentar la estrategia multi-modelo del sistema

---

### 🔗 Correlaciones (`/api/correlations`)

#### `GET /api/correlations/matrix`

Matriz de correlación completa.

**Respuesta:**

```json
{
  "variables": [
    "VOLUMEN_ENTRADA_FINAL",
    "VOLUMEN_SALIDA_FINAL",
    "PERDIDAS_FINAL",
    "INDICE_PERDIDAS_FINAL",
    "PRESION_FINAL",
    "TEMPERATURA_FINAL"
  ],
  "matrix": [
    [1.0, 0.996, -0.503, -0.202, 0.114, 0.165],
    [0.996, 1.0, -0.576, -0.255, 0.107, 0.218]
    // ... matriz 6x6
  ]
}
```

#### `GET /api/correlations/top?limit=5`

Top correlaciones positivas y negativas.

**Respuesta:**

```json
{
  "top_positive": [
    {
      "var1": "VOLUMEN_ENTRADA_FINAL",
      "var2": "VOLUMEN_SALIDA_FINAL",
      "corr": 0.9962
    }
  ],
  "top_negative": [
    {
      "var1": "VOLUMEN_SALIDA_FINAL",
      "var2": "PERDIDAS_FINAL",
      "corr": -0.5762
    }
  ]
}
```

#### `GET /api/correlations/variable/{variable_name}`

Correlaciones de una variable específica.

**Respuesta:**

```json
{
  "variable": "VOLUMEN_ENTRADA_FINAL",
  "correlations": [
    {
      "variable": "VOLUMEN_SALIDA_FINAL",
      "correlation": 0.9962
    }
  ],
  "strongest_positive": { "variable": "...", "correlation": 0.996 },
  "strongest_negative": { "variable": "...", "correlation": -0.576 }
}
```

---

### 🚨 Alertas (`/api/alerts`)

#### `GET /api/alerts/?nivel=ALTO&valvula=VALVULA_1`

Obtiene todas las alertas.

**Query params:**

- `nivel` (opcional): BAJO, MEDIO, ALTO, CRITICO
- `valvula` (opcional): Filtrar por válvula

**Respuesta:**

```json
{
  "alertas": [
    {
      "valvula": "VALVULA_1",
      "nivel": "ALTO",
      "mensajes": "Pérdidas negativas en 4 periodo(s)",
      "metricas": {
        "indice_perdidas": 48.03,
        "entrada_promedio": 366.5
      }
    }
  ],
  "total": 5
}
```

#### `GET /api/alerts/stats`

Estadísticas de alertas por nivel.

**Respuesta:**

```json
{
  "total": 7,
  "criticas": 2,
  "altas": 3,
  "medias": 2,
  "bajas": 0
}
```

#### `GET /api/alerts/valvula/{valvula_id}`

Alertas de una válvula específica.

**Respuesta:**

```json
{
  "valvula": "VALVULA_1",
  "alertas": [
    /* array */
  ],
  "total": 1,
  "nivel_mas_alto": "ALTO"
}
```

#### `GET /api/alerts/critical`

Solo alertas críticas.

**Respuesta:**

```json
{
  "alertas": [
    /* array */
  ],
  "total": 2,
  "requires_immediate_action": true
}
```

---

## 🛠️ Desarrollo

### Estructura del Proyecto

```
backend/
├── app/
│   ├── main.py              # Entry point
│   ├── config.py            # Configuración
│   ├── api/
│   │   └── routes/          # Endpoints
│   │       ├── dashboard.py
│   │       ├── balances.py
│   │       ├── models.py
│   │       ├── correlations.py
│   │       └── alerts.py
│   ├── services/
│   │   └── data_loader.py   # Carga de CSVs
│   └── schemas/
│       └── responses.py     # Modelos Pydantic
└── requirements.txt
```

### Agregar Nuevo Endpoint

1. Crear función en el router correspondiente
2. Agregar schemas Pydantic si es necesario
3. Documentar con docstrings
4. Probar en `/docs`

---

## 📝 Notas

- **CORS**: Configurado para `localhost:5173` (Vite dev server)
- **Encoding**: CSVs usan separador `;` y encoding UTF-8
- **Caching**: DataLoader implementa caché de DataFrames
- **Errores**: HTTP 404 para recursos no encontrados, 500 para errores internos

---

## 🔧 Variables de Entorno

```env
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true
DATA_PATH=../BALANC-IA
FRONTEND_URL=http://localhost:5173
```

---

## 📞 Soporte

Para reportar problemas o solicitar features, contactar al equipo de desarrollo.
