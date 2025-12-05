# API de Alertas - Documentación Completa

## 📋 Resumen

El módulo de alertas proporciona endpoints completos para gestionar y monitorear alertas del sistema de balance de gas. Incluye soporte para filtrado avanzado, actualización de estados y estadísticas en tiempo real.

## 🔗 Endpoints Disponibles

### 1. `GET /api/alerts/`

Obtiene todas las alertas con múltiples opciones de filtrado.

**Query Parameters:**

- `nivel` (opcional): Filtrar por nivel - BAJO, MEDIO, ALTO, CRITICO
- `valvula` (opcional): Filtrar por válvula - VALVULA_1, VALVULA_2, etc.
- `estado` (opcional): Filtrar por estado - pendiente, revisada, resuelta
- `tipo` (opcional): Filtrar por tipo - Desbalance, Anomalía
- `severidad` (opcional): Filtrar por severidad - critica, alta, media, baja

**Ejemplo de Request:**

```bash
GET /api/alerts/?estado=pendiente&severidad=critica
```

**Respuesta:**

```json
{
  "alertas": [
    {
      "id": 1,
      "fecha": "2025-12-04 14:30",
      "valvula": "VALVULA_1",
      "ubicacion": "Sector Norte",
      "tipo": "Anomalía",
      "severidad": "alta",
      "descripcion": "Detección de pérdidas negativas en 4 periodo(s). Índice de pérdidas de 48.0%. Requiere revisión de datos o posibles inconsistencias en mediciones.",
      "estado": "pendiente",
      "metricas": {
        "indice_perdidas": 48.03,
        "entrada_promedio": 366.5,
        "volumen_perdido": 176.05,
        "umbral": 12.0
      }
    }
  ],
  "total": 1
}
```

### 2. `GET /api/alerts/stats`

Obtiene estadísticas extendidas de alertas por estado y severidad.

**Respuesta:**

```json
{
  "total": 8,
  "pendientes": 3,
  "revisadas": 3,
  "resueltas": 2,
  "criticas": 0,
  "altas": 5,
  "medias": 0,
  "bajas": 0
}
```

### 3. `GET /api/alerts/valvula/{valvula_id}`

Obtiene todas las alertas de una válvula específica.

**Path Parameters:**

- `valvula_id`: ID de la válvula (ej: VALVULA_1)

**Ejemplo de Request:**

```bash
GET /api/alerts/valvula/VALVULA_1
```

**Respuesta:**

```json
{
  "alertas": [
    {
      "id": 1,
      "fecha": "2025-12-04 14:30",
      "valvula": "VALVULA_1",
      "ubicacion": "Sector Norte",
      "tipo": "Anomalía",
      "severidad": "alta",
      "descripcion": "Detección de pérdidas negativas en 4 periodo(s)...",
      "estado": "pendiente",
      "metricas": {...}
    }
  ],
  "total": 1
}
```

### 4. `GET /api/alerts/critical`

Obtiene solo las alertas de nivel crítico.

**Respuesta:**

```json
{
  "alertas": [],
  "total": 0
}
```

### 5. `GET /api/alerts/recent?limit=10`

Obtiene las alertas más recientes (ordenadas por fecha).

**Query Parameters:**

- `limit` (opcional): Número máximo de alertas a retornar (default: 10, max: 100)

**Ejemplo de Request:**

```bash
GET /api/alerts/recent?limit=5
```

### 6. `PATCH /api/alerts/{alert_id}` ⭐ NUEVO

Actualiza el estado de una alerta específica.

**Path Parameters:**

- `alert_id`: ID de la alerta a actualizar

**Body:**

```json
{
  "estado": "revisada"
}
```

Estados válidos: `pendiente`, `revisada`, `resuelta`

**Respuesta:**

```json
{
  "success": true,
  "message": "Estado de alerta 1 actualizado a 'revisada'",
  "alert": {
    "id": 1,
    "fecha": "2025-12-04 14:30",
    "valvula": "VALVULA_1",
    "ubicacion": "Sector Norte",
    "tipo": "Anomalía",
    "severidad": "alta",
    "descripcion": "...",
    "estado": "revisada",
    "metricas": {...}
  }
}
```

**Ejemplo con cURL:**

```bash
curl -X PATCH "http://localhost:8000/api/alerts/1" \
  -H "Content-Type: application/json" \
  -d '{"estado": "resuelta"}'
```

**Ejemplo con JavaScript/Fetch:**

```javascript
const updateAlertStatus = async (alertId, newStatus) => {
  const response = await fetch(`http://localhost:8000/api/alerts/${alertId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ estado: newStatus }),
  });
  return response.json();
};

// Uso
await updateAlertStatus(1, "resuelta");
```

## 📊 Estructura de Datos

### Alert Object

```typescript
interface Alert {
  id: number; // ID único de la alerta
  fecha: string; // Fecha en formato "YYYY-MM-DD HH:MM"
  valvula: string; // ID de la válvula (ej: "VALVULA_1")
  ubicacion: string; // Sector de la válvula
  tipo: "Desbalance" | "Anomalía"; // Tipo de alerta
  severidad: "critica" | "alta" | "media" | "baja"; // Severidad
  descripcion: string; // Descripción detallada
  estado: "pendiente" | "revisada" | "resuelta"; // Estado
  metricas: {
    indice_perdidas?: number; // Índice de pérdidas (%)
    entrada_promedio?: number; // Volumen promedio de entrada (m³)
    volumen_perdido?: number; // Volumen estimado perdido (m³)
    desviacion?: number; // Desviación respecto a lo esperado (%)
    umbral?: number; // Umbral crítico (%)
  };
}
```

## 🔧 Integración con Frontend

### Ejemplo completo de uso en React:

```jsx
import { useState, useEffect } from "react";

const AlertsComponent = () => {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar alertas
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/alerts/");
        const data = await response.json();
        setAlerts(data.alertas);
      } catch (error) {
        console.error("Error al cargar alertas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Cargar estadísticas
  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch("http://localhost:8000/api/alerts/stats");
      const data = await response.json();
      setStats(data);
    };

    fetchStats();
  }, []);

  // Actualizar estado de alerta
  const handleUpdateStatus = async (alertId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/alerts/${alertId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: newStatus }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Actualizar lista local
        setAlerts(alerts.map((a) => (a.id === alertId ? data.alert : a)));
      }
    } catch (error) {
      console.error("Error al actualizar alerta:", error);
    }
  };

  // Filtrar alertas
  const fetchFilteredAlerts = async (filters) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`http://localhost:8000/api/alerts/?${params}`);
    const data = await response.json();
    setAlerts(data.alertas);
  };

  return (
    <div>
      {/* Estadísticas */}
      {stats && (
        <div>
          <p>Total: {stats.total}</p>
          <p>Pendientes: {stats.pendientes}</p>
          <p>Críticas: {stats.criticas}</p>
        </div>
      )}

      {/* Lista de alertas */}
      {alerts.map((alert) => (
        <div key={alert.id}>
          <h3>
            {alert.valvula} - {alert.ubicacion}
          </h3>
          <p>{alert.descripcion}</p>
          <p>Estado: {alert.estado}</p>

          {/* Botones de acción */}
          <button onClick={() => handleUpdateStatus(alert.id, "revisada")}>
            Marcar como Revisada
          </button>
          <button onClick={() => handleUpdateStatus(alert.id, "resuelta")}>
            Resolver
          </button>
        </div>
      ))}
    </div>
  );
};
```

## 🎯 Casos de Uso

### 1. Dashboard de alertas recientes

```javascript
fetch("http://localhost:8000/api/alerts/recent?limit=5")
  .then((res) => res.json())
  .then((data) => console.log(data.alertas));
```

### 2. Filtrar alertas pendientes críticas

```javascript
fetch("http://localhost:8000/api/alerts/?estado=pendiente&severidad=critica")
  .then((res) => res.json())
  .then((data) => console.log(data.alertas));
```

### 3. Ver alertas de una válvula específica

```javascript
fetch("http://localhost:8000/api/alerts/valvula/VALVULA_1")
  .then((res) => res.json())
  .then((data) => console.log(data.alertas));
```

### 4. Actualizar flujo de trabajo de alertas

```javascript
// 1. Listar alertas pendientes
const pendientes = await fetch(
  "http://localhost:8000/api/alerts/?estado=pendiente"
);

// 2. Revisar una alerta
await fetch("http://localhost:8000/api/alerts/1", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ estado: "revisada" }),
});

// 3. Resolver la alerta después de investigación
await fetch("http://localhost:8000/api/alerts/1", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ estado: "resuelta" }),
});
```

## 🔄 Flujo de Estados

```
┌─────────────┐
│  pendiente  │ ──────────┐
└─────────────┘           │
       │                  │
       ▼                  │
┌─────────────┐           │
│  revisada   │           │
└─────────────┘           │
       │                  │
       ▼                  │
┌─────────────┐           │
│  resuelta   │ ◄─────────┘
└─────────────┘
```

- **pendiente**: Alerta recién detectada, requiere atención
- **revisada**: Equipo técnico revisó la alerta
- **resuelta**: Problema investigado y solucionado

## 🚨 Manejo de Errores

### Error 400 - Estado inválido

```json
{
  "detail": "Estado inválido. Debe ser uno de: pendiente, revisada, resuelta"
}
```

### Error 404 - Alerta no encontrada

```json
{
  "detail": "Alerta con ID 999 no encontrada"
}
```

### Error 500 - Error del servidor

```json
{
  "detail": "Error al obtener alertas: [mensaje de error]"
}
```

## 📝 Notas Importantes

1. **Persistencia**: Los estados de alertas se mantienen en memoria. En producción, se recomienda usar una base de datos.

2. **Fechas**: Las fechas se generan dinámicamente para simular alertas recientes (últimos 5 días).

3. **Métricas calculadas**: El campo `volumen_perdido` se calcula automáticamente basado en `entrada_promedio` e `indice_perdidas`.

4. **Sectores**: Los sectores de las válvulas están predefinidos en el servidor.

5. **Estados iniciales**: Las alertas críticas inician como "pendiente", las demás tienen estados aleatorios para simular un sistema en uso.

## 🧪 Testing

Para probar los endpoints, puedes usar la documentación interactiva de FastAPI:

```
http://localhost:8000/docs
```

O usar herramientas como Postman, Insomnia, o cURL.
