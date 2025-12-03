# EPM Hackathon - Sistema de Predicción de Balances de Gas

## Resumen del Proyecto

Sistema web para predicción y monitoreo de balances virtuales en la red de distribución secundaria de gas natural. Desarrollado para el hackathon de EPM (empresa de servicios públicos colombiana), permite calcular y predecir pérdidas de gas en puntos de medición (válvulas de anillo) donde no hay macromedidores instalados.

## Objetivos

- Predecir balances virtuales usando datos históricos de macromedición
- Identificar y alertar sobre desbalances y anomalías en la red
- Proporcionar herramientas de visualización y análisis para diferentes roles de usuario
- Optimizar la gestión operativa mediante modelos de Machine Learning (XGBoost y Prophet)

## Stack Tecnológico

### Frontend (Implementado)

- **Framework**: React 18 con Vite
- **Estilos**: Tailwind CSS v4 con tema personalizado EPM
- **Visualizaciones**: Recharts
- **Estado**: Zustand con persistencia en localStorage
- **Routing**: React Router v6
- **Iconos**: Lucide React
- **HTTP Client**: Axios (preparado para backend)

### Backend (Pendiente)

- **Framework**: FastAPI (Python)
- **ML Models**: XGBoost y Prophet para predicción de balances
- **Data Processing**: Pandas, NumPy
- **Entrenamiento**: Google Colab (opcional)

### Extras (Opcionales)

- **Bot**: Telegram bot para usuarios operativos (comandos: /balance, /alertas)

## Arquitectura del Sistema

### Sistema de Roles (RBAC)

El sistema implementa 3 roles con permisos específicos:

#### 1. **ADMIN** (Administrador)

- Acceso completo a todos los módulos
- Gestión de datos (carga de archivos CSV/Excel)
- Configuración y reentrenamiento de modelos
- Visualización de logs de operaciones

#### 2. **DECISION_MAKER** (Tomador de Decisiones)

- Dashboard ejecutivo con KPIs
- Análisis de correlaciones
- Comparación de modelos
- Consulta de alertas críticas
- Sin acceso a configuración ni gestión de datos

#### 3. **OPERATOR** (Operativo)

- Consulta de balances por válvula
- Visualización de alertas
- Acceso limitado a información operativa diaria

### Paleta de Colores EPM

```css
--color-primary: #008f4c; /* Verde EPM principal */
--color-secondary: #2e7d5f; /* Verde oscuro */
--color-success: #6fcf97; /* Verde éxito */
--color-warning: #f7b731; /* Amarillo advertencia */
--color-error: #c0392b; /* Rojo error */
--color-backgroundMain: #f8f9fa;
--color-backgroundSecondary: #e9ecef;
--color-textMain: #1f2937;
--color-textSecondary: #6b7280;
--color-border: #d1d5db;
```

## Estructura del Proyecto

```
epm-hackathon/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx          # Wrapper principal con sidebar
│   │   │   └── Sidebar.jsx         # Sidebar colapsable con navegación por rol
│   │   ├── ui/                     # Componentes reutilizables
│   │   │   ├── AlertCard.jsx       # Tarjeta individual de alerta
│   │   │   ├── AlertsTable.jsx     # Tabla de alertas con filtros
│   │   │   ├── AlertStatsCard.jsx  # Estadísticas de alertas
│   │   │   ├── BalanceTable.jsx    # Tabla de balances mensuales
│   │   │   ├── DataStatusCard.jsx  # Estado de datos ingestados
│   │   │   ├── KPICard.jsx         # Tarjeta de métrica con tendencia
│   │   │   ├── LogsTable.jsx       # Historial de operaciones
│   │   │   ├── ModelComparisonCard.jsx    # Comparación XGBoost vs Prophet
│   │   │   ├── ModelDetailsCard.jsx       # Detalles técnicos del modelo
│   │   │   ├── RetrainModelCard.jsx       # Control de reentrenamiento
│   │   │   ├── SystemHealthIndicator.jsx  # Indicador circular de salud
│   │   │   ├── TopCorrelationsCard.jsx    # Top correlaciones positivas/negativas
│   │   │   ├── TopValvesTable.jsx         # Top 5 válvulas con pérdidas
│   │   │   └── UploadCard.jsx             # Carga de archivos drag-drop
│   │   └── charts/                 # Gráficos con Recharts
│   │       ├── AlertEvolutionChart.jsx    # Evolución temporal de alertas
│   │       ├── BalanceChart.jsx           # Volúmenes entrada/salida/pérdidas
│   │       ├── CorrelationMatrix.jsx      # Matriz de correlaciones 6x6
│   │       ├── InteractiveScatterPlot.jsx # Scatter dinámico con selección XY
│   │       ├── LossIndexChart.jsx         # Evolución índice de pérdidas
│   │       ├── ModelMetricsChart.jsx      # Métricas MAE/RMSE/R² por modelo
│   │       └── PredictionScatterChart.jsx # Real vs Predicho
│   ├── pages/
│   │   ├── Admin.jsx               # Gestión de datos (ADMIN only)
│   │   ├── Dashboard.jsx           # KPIs ejecutivos
│   │   ├── Models.jsx              # Comparación y análisis de modelos
│   │   ├── Correlations.jsx        # Análisis de correlaciones
│   │   ├── Balances.jsx            # Consulta por válvula
│   │   └── Alerts.jsx              # Gestión de alertas
│   ├── stores/
│   │   └── userStore.js            # Estado global con Zustand (rol actual)
│   ├── utils/
│   │   └── constants.js            # Roles, permisos, navegación
│   ├── services/                   # (Vacío - preparado para API calls)
│   ├── App.jsx                     # Router principal
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Estilos globales con theme
├── public/                         # Assets estáticos
├── vite.config.js                  # Config Vite + Tailwind v4
├── package.json
└── README.md
```

## Módulos Implementados

### 1. **Gestión de Datos (Admin)**

- Carga de archivos CSV/Excel con drag-drop
- Validación de datos ingestados
- Cards de estado (última actualización, registros, validación)
- Sistema de reentrenamiento de modelos
- Tabla de logs con historial de operaciones

### 2. **Dashboard Ejecutivo**

- 4 KPI cards: MAE, RMSE, Pérdidas Totales, Válvulas Monitoreadas
- Gráfico de evolución del índice de pérdidas (real vs predicho)
- Tabla Top 5 válvulas con mayores pérdidas
- Indicador circular de salud del sistema

### 3. **Modelos**

- Comparación lado a lado XGBoost vs Prophet
- Selector de métrica (MAE, RMSE, R²)
- Gráfico de barras comparativo
- Scatter plot Real vs Predicho con línea de referencia
- Detalles técnicos expandibles (hiperparámetros, features)

### 4. **Correlaciones**

- Grid de top correlaciones (positivas/negativas)
- Matriz de correlación 6x6 estilo heatmap
- Scatter plot interactivo con selección de variables X/Y
- Cards de insights con interpretación

### 5. **Balances**

- Selector de válvula con búsqueda
- 3 KPIs por válvula (índice promedio, total pérdidas, meses analizados)
- Gráfico de barras agrupadas (entrada/salida/pérdidas)
- Tabla mensual con índices color-coded y badges real/predicho

### 6. **Alertas**

- Estadísticas por estado (pendientes/revisadas/resueltas)
- Estadísticas por severidad (crítica/alta/media/baja)
- Gráfico de evolución temporal
- Vista dual: tabla con filtros o tarjetas
- Sistema de gestión de estados (marcar revisada/resuelta)
- Filtros: estado, severidad, tipo, válvula

## Estado Actual del Desarrollo

### ✅ Completado

- Setup completo del proyecto (Vite + React + Tailwind v4)
- Sistema de roles con RBAC (3 roles, matriz de permisos)
- Sidebar colapsable con navegación por rol
- Los 6 módulos principales del frontend
- 30+ componentes reutilizables
- 7 gráficos con Recharts
- Mock data completo en todos los módulos
- Tema personalizado con colores EPM
- Diseño responsive

### 🔄 Pendiente

- Desarrollo del backend FastAPI
- Entrenamiento de modelos ML (XGBoost, Prophet)
- Integración frontend-backend (API calls con Axios)
- Sistema de autenticación real
- Telegram bot (opcional)
- Conexión con datos reales de EPM

## Variables y Métricas Clave

### Variables Utilizadas

- **volumen_entrada**: Volumen de gas que ingresa al punto
- **volumen_salida**: Volumen de gas que sale del punto
- **volumen_perdido**: Diferencia entre entrada y salida
- **indice_perdidas**: Porcentaje de pérdidas (pérdidas/entrada \* 100)
- **presion_entrada/salida**: Presión en puntos de medición
- **temperatura**: Temperatura ambiente
- **demanda_promedio**: Consumo promedio esperado

### Métricas de Evaluación

- **MAE** (Mean Absolute Error): Error absoluto promedio
- **RMSE** (Root Mean Square Error): Raíz del error cuadrático medio
- **R²** (R-squared): Coeficiente de determinación

### Umbrales de Alerta

- **Crítica**: Índice de pérdidas > 12%
- **Alta**: Índice de pérdidas > 10%
- **Media**: Índice de pérdidas > 8%
- **Baja**: Índice de pérdidas ≤ 8%

## Mock Data Pattern

Todos los módulos usan mock data con estructuras consistentes:

```javascript
// Ejemplo de alerta
{
  id: 1,
  fecha: '2025-08-15 14:30',
  valvula: 'V-402',
  ubicacion: 'Sector Norte',
  tipo: 'Desbalance',
  severidad: 'critica',
  descripcion: '...',
  estado: 'pendiente',
  metricas: { indicePerdidas: 14.2, volumenPerdido: 1850 }
}

// Ejemplo de balance
{
  month: 'Enero 2025',
  entrada: 12500,
  salida: 11450,
  perdidas: 1050,
  indice: 8.4,
  tipo: 'real'
}
```

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview
```

## Notas para Desarrollo Futuro

### Backend API Endpoints (Planificados)

```
POST   /api/upload          # Carga de datos CSV
GET    /api/data/status     # Estado de datos
POST   /api/models/retrain  # Reentrenar modelo
GET    /api/models/metrics  # Métricas de modelos
GET    /api/predictions     # Predicciones por válvula
GET    /api/correlations    # Matriz de correlaciones
GET    /api/alerts          # Listar alertas
PATCH  /api/alerts/:id      # Actualizar estado de alerta
GET    /api/balances/:valve # Balance por válvula
GET    /api/logs            # Historial de operaciones
```

### Consideraciones de Seguridad

- Implementar JWT para autenticación
- Middleware de autorización por rol
- Validación de archivos subidos (tipo, tamaño, formato)
- Rate limiting en endpoints de predicción
- Sanitización de inputs

### Optimizaciones Futuras

- Lazy loading de módulos
- Virtualización de tablas grandes
- Cache de predicciones frecuentes
- WebSockets para alertas en tiempo real
- Service Worker para offline support

## Contacto y Recursos

- **Proyecto**: Hackathon EPM - Predicción de Balances de Gas
- **Empresa**: EPM (Empresas Públicas de Medellín)
- **Stack Docs**:
  - [React](https://react.dev)
  - [Vite](https://vitejs.dev)
  - [Tailwind CSS](https://tailwindcss.com)
  - [Recharts](https://recharts.org)
  - [FastAPI](https://fastapi.tiangolo.com)
