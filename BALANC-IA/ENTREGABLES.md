# 📋 ENTREGABLES DEL PROYECTO - BALANCES VIRTUALES

## ✅ Entregables Completados

### 1. 📊 Tabla de Balances Virtuales por Punto y Mes (m³) + Índice de Pérdidas

**Archivo:** `Tabla_Balances_Virtuales.csv`

**Contenido:**
- PUNTO (Válvula)
- PERIODO, AÑO, MES, FECHA
- ENTRADA_m3 (Volumen de entrada en m³)
- SALIDA_m3 (Volumen de salida en m³)
- PERDIDAS_m3 (Pérdidas en m³)
- INDICE_PERDIDAS_% (Índice de pérdidas en porcentaje)
- ES_PRONOSTICO (Indicador si es período pronosticado)

**Generado por:** Celda 17

---

### 2. 📈 Métricas de Performance del Modelo y Benchmark frente a Histórico

**Archivos generados:**
- `Reporte_Metricas_Performance.csv` - Reporte consolidado de métricas
- `Benchmark_Historico_vs_Pronostico.csv` - Comparación detallada histórico vs pronóstico

**Contenido:**

#### 2.1 Métricas del Modelo (Validación Temporal)
- **MAE** (Mean Absolute Error)
- **RMSE** (Root Mean Squared Error)
- **MAPE** (Mean Absolute Percentage Error)
- **MASE** (Mean Absolute Scaled Error)
- Métricas por modelo y por válvula
- Identificación del mejor modelo por válvula

#### 2.2 Benchmark: Histórico vs Pronóstico
- Comparación de promedios (entrada, salida, pérdidas, índice)
- Diferencias porcentuales
- Análisis de consistencia
- Z-scores para evaluar calidad del pronóstico

**Generado por:** Celda 18

---

### 3. 📓 Notebook / Script Reproducible

**Archivo:** `BALANC_IA (1).ipynb`

**Componentes:**
- ✅ **ETL Completo:**
  - Carga y procesamiento de datos de entrada
  - Agregación de macromedición mensual
  - Agregación de usuarios por válvula
  - Construcción del dataset maestro

- ✅ **Feature Engineering:**
  - Features temporales (MES, AÑO, DIA_AÑO)
  - Lags y medias móviles (LAG_1, MA_3, MA_6)
  - Features de interacción (PRESION_TEMP, CONSUMO_POR_USUARIO)
  - Manejo de valores faltantes

- ✅ **Modelos Implementados:**
  - Prophet (series de tiempo)
  - LightGBM (gradient boosting)
  - Random Forest
  - CatBoost
  - Prophet + LSTM (híbrido, opcional)

- ✅ **Scoring:**
  - Validación temporal (80/20 split)
  - Ensemble inteligente con pesos basados en métricas
  - Predicciones por válvula y período
  - Cálculo de pérdidas e índice de pérdidas

**Reproducibilidad:**
- Todas las celdas están documentadas
- Semillas aleatorias fijadas (random_state=42)
- Manejo consistente de formatos (sep=';', decimal=',')
- Fallbacks automáticos para casos edge

---

### 4. 📊 Dashboard / Reporte

**Archivo principal:** `dashboard/Dashboard_Balances_Virtuales.html`

**Componentes:**

#### 4.1 Gráficos de Series Temporales
- **Por válvula:** Gráficos interactivos con 3 paneles:
  1. Entrada vs Salida (m³)
  2. Pérdidas (m³)
  3. Índice de Pérdidas (%)
- Diferenciación visual entre histórico (línea sólida) y pronóstico (línea punteada)
- Archivos: `dashboard/grafica_VALVULA_X.html`

#### 4.2 Alertas por Punto
**Archivo:** `dashboard/Alertas_Puntos.csv`

**Tipos de alertas:**
- 🚨 **CRÍTICO:** Índice de pérdidas ≥ 25%
- ⚠️ **ALTO:** 
  - Índice de pérdidas ≥ 15%
  - Variación en entrada ≥ 30%
  - Pérdidas negativas detectadas
  - Valores faltantes
- ✅ **OK:** Sin alertas

#### 4.3 Top Desbalances
**Archivos:**
- `dashboard/Top_Desbalances.csv` - Análisis completo
- `dashboard/Top10_Perdidas_Absolutas.csv` - Top 10 por pérdidas absolutas
- `dashboard/Top10_Indice_Perdidas.csv` - Top 10 por índice de pérdidas

**Métricas incluidas:**
- Pérdidas promedio (m³)
- Índice de pérdidas (%)
- Entrada promedio (m³)
- Salida promedio (m³)
- Número de períodos

**Generado por:** Celda 19

---

## 📁 Estructura de Archivos Generados

```
BALANC-IA/
├── Tabla_Balances_Virtuales.csv          # Entregable 1
├── Reporte_Metricas_Performance.csv       # Entregable 2
├── Benchmark_Historico_vs_Pronostico.csv  # Entregable 2
├── BALANC_IA (1).ipynb                    # Entregable 3
├── dashboard/
│   ├── Dashboard_Balances_Virtuales.html # Entregable 4
│   ├── grafica_VALVULA_*.html            # Gráficos individuales
│   ├── Alertas_Puntos.csv                 # Alertas
│   ├── Top_Desbalances.csv                # Análisis completo
│   ├── Top10_Perdidas_Absolutas.csv       # Top 10 pérdidas
│   └── Top10_Indice_Perdidas.csv          # Top 10 índice
└── [Archivos intermedios del proceso]
```

---

## 🚀 Cómo Ejecutar

1. **Abrir el notebook:** `BALANC_IA (1).ipynb`
2. **Ejecutar todas las celdas en orden:**
   - Celdas 1-12: ETL y preparación de datos
   - Celda 15: Entrenamiento de modelos mejorados
   - Celda 16: Análisis de resultados
   - Celda 17: Generar tabla de balances virtuales
   - Celda 18: Generar métricas y benchmark
   - Celda 19: Generar dashboard
3. **Revisar entregables:**
   - Abrir `dashboard/Dashboard_Balances_Virtuales.html` en navegador
   - Revisar archivos CSV generados

---

## 📊 Métricas Clave del Modelo

Según los resultados obtenidos:

- **VALVULA_1:** CatBoost (MAE: 71.41, MAPE: 15.29%)
- **VALVULA_2:** LightGBM (MAE: 323.74, MAPE: 18.04%)
- **VALVULA_3:** Random Forest (MAE: 1090.91, MAPE: 3.87%)
- **VALVULA_4:** CatBoost (MAE: 3602.33, MAPE: 11.33%)

El ensemble combina automáticamente los mejores modelos según las métricas de validación.

---

## 🔧 Dependencias

Ver `instalar_dependencias.py` o instalar manualmente:

```bash
pip install pandas numpy prophet lightgbm scikit-learn catboost
pip install plotly  # Para gráficos interactivos
pip install tensorflow  # Opcional para LSTM
```

---

## 📝 Notas

- Todos los archivos CSV usan separador `;` y decimal `,` (formato latino)
- El dashboard HTML es interactivo y se puede abrir en cualquier navegador
- Los gráficos son generados con Plotly (interactivos, zoom, hover)
- Las alertas se generan automáticamente según umbrales configurables
- El notebook es completamente reproducible con semillas fijadas

---

**Fecha de generación:** 2024
**Versión del modelo:** Mejorado con múltiples algoritmos (Prophet, LightGBM, Random Forest, CatBoost, Prophet+LSTM)

