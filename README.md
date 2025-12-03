# InteliBalance 🌿

**El balance virtual confirma: _Estamos Ahí_**

Sistema predictivo desarrollado para el Hackathon 2025 de EPM, diseñado para optimizar la gestión de pérdidas y anomalías en la red secundaria de distribución de gas natural mediante Machine Learning.

---

## 📋 Descripción

InteliBalance es una plataforma web que permite predecir y monitorear balances virtuales en puntos de medición (válvulas de anillo) donde no hay macromedidores instalados. Utiliza algoritmos avanzados de ML (XGBoost y Prophet) para:

- ✅ Predecir volúmenes corregidos usando datos históricos
- ✅ Detectar tempranamente desbalances y anomalías
- ✅ Reducir pérdidas técnicas y no técnicas
- ✅ Mantener continuidad operativa post-traslado de medidores
- ✅ Generar alertas inteligentes para irregularidades

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/your-repo/intelibalance.git
cd intelibalance

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Acceder a http://localhost:5173
```

### Scripts Disponibles

```bash
npm run dev      # Modo desarrollo con hot reload
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Ejecutar ESLint
```

---

## 🏗️ Stack Tecnológico

### Frontend

- **Framework:** React 18 + Vite
- **Estilos:** Tailwind CSS v4 con tema personalizado EPM
- **Gráficos:** Recharts
- **Estado:** Zustand con persistencia en localStorage
- **Routing:** React Router v6
- **Iconos:** Lucide React
- **HTTP:** Axios (preparado para backend)

### Backend (Pendiente)

- FastAPI (Python)
- XGBoost + Prophet para predicción
- Pandas/NumPy para procesamiento

---

## 👥 Sistema de Roles (RBAC)

InteliBalance implementa 3 roles con permisos específicos:

| Rol                | Permisos                                    | Módulos                                    |
| ------------------ | ------------------------------------------- | ------------------------------------------ |
| **ADMIN**          | Acceso completo, gestión de datos y modelos | Todos + Admin Panel                        |
| **DECISION_MAKER** | Dashboard ejecutivo, análisis y métricas    | Dashboard, Modelos, Correlaciones, Alertas |
| **OPERATOR**       | Consulta de balances y alertas operativas   | Balances, Alertas (solo consulta)          |

---

## 📁 Estructura del Proyecto

```
epm-hackathon/
├── src/
│   ├── components/
│   │   ├── layout/          # Layout y Sidebar
│   │   ├── ui/              # 15+ componentes reutilizables
│   │   └── charts/          # 7 gráficos con Recharts
│   ├── pages/
│   │   ├── Landing.jsx      # Landing page pública
│   │   ├── Login.jsx        # Selección de roles
│   │   ├── Dashboard.jsx    # KPIs ejecutivos
│   │   ├── Models.jsx       # Comparación de modelos
│   │   ├── Correlations.jsx # Análisis de correlaciones
│   │   ├── Balances.jsx     # Consulta por válvula
│   │   ├── Alerts.jsx       # Gestión de alertas
│   │   └── Admin.jsx        # Panel administrativo
│   ├── stores/              # Estado global con Zustand
│   ├── utils/               # Constantes y helpers
│   └── services/            # API calls (preparado)
├── public/
│   └── documentacion/       # PDFs y recursos
├── PROJECT_CONTEXT.md       # Contexto completo del proyecto
├── ENLACES_IMPORTANTES.md   # Guía de configuración de enlaces
└── README.md
```

---

## 🎨 Paleta de Colores EPM

```css
--color-primary: #008f4c; /* Verde EPM principal */
--color-secondary: #2e7d5f; /* Verde oscuro */
--color-success: #6fcf97; /* Verde éxito */
--color-warning: #f7b731; /* Amarillo advertencia */
--color-error: #c0392b; /* Rojo error */
```

---

## 📊 Módulos Implementados

### 1. **Landing Page**

- Hero section con llamadas a acción
- Descripción de funcionalidades y beneficios
- Integración con servicios EPM
- Footer con créditos y enlaces

### 2. **Gestión de Datos (Admin)**

- Carga de archivos CSV/Excel
- Validación de datos
- Reentrenamiento de modelos
- Historial de operaciones

### 3. **Dashboard Ejecutivo**

- 4 KPIs principales (MAE, RMSE, Pérdidas, Válvulas)
- Evolución del índice de pérdidas
- Top 5 válvulas con mayores pérdidas
- Indicador de salud del sistema

### 4. **Modelos**

- Comparación XGBoost vs Prophet
- Métricas de evaluación (MAE, RMSE, R²)
- Scatter plot Real vs Predicho
- Detalles técnicos expandibles

### 5. **Correlaciones**

- Matriz de correlación 6x6
- Top correlaciones positivas/negativas
- Scatter plot interactivo

### 6. **Balances**

- Selector de válvula con búsqueda
- Gráfico de volúmenes (entrada/salida/pérdidas)
- Tabla mensual con índices color-coded

### 7. **Alertas**

- Estadísticas por estado y severidad
- Vista dual: tabla o tarjetas
- Sistema de gestión de estados
- Filtros avanzados

---

## ⚙️ Configuración Previa al Despliegue

Antes de desplegar, actualiza los siguientes enlaces placeholder:

### 1. Bot de Telegram

Ubicación: `src/pages/Landing.jsx`

```javascript
// Línea 11-12
const TELEGRAM_BOT_URL = "https://t.me/YOUR_BOT_USERNAME";
```

### 2. Repositorio GitHub

Ubicación: `src/pages/Landing.jsx`

```javascript
// Línea 14-15
const GITHUB_REPO_URL = "https://github.com/YOUR_REPO/intelibalance";
```

### 3. PDF de Documentación

Coloca tu PDF en: `public/documentacion/funcionamiento-completo.pdf`

**Ver `ENLACES_IMPORTANTES.md` para detalles completos.**

---

## 🔐 Seguridad (Futuro)

- [ ] Implementar JWT para autenticación
- [ ] Middleware de autorización por rol
- [ ] Validación de archivos subidos
- [ ] Rate limiting en endpoints
- [ ] Sanitización de inputs

---

## 🛣️ Roadmap

### ✅ Completado

- Setup completo del proyecto
- Sistema RBAC con 3 roles
- 7 módulos del frontend
- 30+ componentes UI
- Mock data en todos los módulos
- Tema personalizado EPM

### 🔄 Pendiente

- Desarrollo backend FastAPI
- Entrenamiento modelos ML
- Integración frontend-backend
- Autenticación real
- Bot de Telegram (opcional)
- Conexión con datos reales EPM

---

## 👨‍💻 Desarrolladores

**Desarrollado para el Hackathon 2025 de EPM por:**

- **Karly Mariana Velasquez Acosta**
- **Julian Santiago Pico Pinzon**

---

## 🔗 Enlaces Relevantes

- **EPM Oficial:** [www.epm.com.co](https://www.epm.com.co/)
- **Revisiones Gas:** [aplicaciones.epm.com.co/revisionesgas](https://aplicaciones.epm.com.co/revisionesgas/#/)
- **Documentación Completa:** Ver `PROJECT_CONTEXT.md`
- **Bot Telegram:** _(Configurar antes de despliegue)_

---

## 📄 Licencia

Proyecto desarrollado para EPM - Empresas Públicas de Medellín E.S.P.

---

## 📞 Soporte

Para dudas o problemas:

- 📧 Email: _(agregar contacto)_
- 💬 Telegram Bot: [t.me/YOUR_BOT](https://t.me/your_bot_username)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/intelibalance/issues)

---

**InteliBalance** - _Transformando la gestión de gas natural con inteligencia artificial_ 🚀
