/**
 * Servicio API para el módulo de Alertas
 * Maneja todas las operaciones CRUD de alertas
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Función helper para hacer requests
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// ==================== ALERTS API ====================

export const alertsAPI = {
  /**
   * Obtener todas las alertas con filtros opcionales
   * GET /api/alerts/
   * @param {Object} filters - Filtros opcionales
   * @param {string} filters.nivel - BAJO, MEDIO, ALTO, CRITICO
   * @param {string} filters.valvula - ID de válvula
   * @param {string} filters.estado - pendiente, revisada, resuelta
   * @param {string} filters.tipo - Desbalance, Anomalía
   * @param {string} filters.severidad - critica, alta, media, baja
   * @returns {Promise<{alertas: Array, total: number}>}
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.nivel) params.append("nivel", filters.nivel);
    if (filters.valvula) params.append("valvula", filters.valvula);
    if (filters.estado) params.append("estado", filters.estado);
    if (filters.tipo) params.append("tipo", filters.tipo);
    if (filters.severidad) params.append("severidad", filters.severidad);

    const queryString = params.toString();
    const endpoint = queryString
      ? `/api/alerts/?${queryString}`
      : "/api/alerts/";

    return fetchAPI(endpoint);
  },

  /**
   * Obtener estadísticas de alertas
   * GET /api/alerts/stats
   * @returns {Promise<{total: number, pendientes: number, revisadas: number, resueltas: number, criticas: number, altas: number, medias: number, bajas: number}>}
   */
  getStats: async () => {
    return fetchAPI("/api/alerts/stats");
  },

  /**
   * Obtener alertas de una válvula específica
   * GET /api/alerts/valvula/{valvula_id}
   * @param {string} valvulaId - ID de la válvula
   * @returns {Promise<{alertas: Array, total: number}>}
   */
  getByValve: async (valvulaId) => {
    return fetchAPI(`/api/alerts/valvula/${valvulaId}`);
  },

  /**
   * Obtener solo alertas críticas
   * GET /api/alerts/critical
   * @returns {Promise<{alertas: Array, total: number}>}
   */
  getCritical: async () => {
    return fetchAPI("/api/alerts/critical");
  },

  /**
   * Obtener alertas recientes
   * GET /api/alerts/recent
   * @param {number} limit - Número máximo de alertas (default: 10, max: 100)
   * @returns {Promise<{alertas: Array, total: number}>}
   */
  getRecent: async (limit = 10) => {
    return fetchAPI(`/api/alerts/recent?limit=${limit}`);
  },

  /**
   * Actualizar el estado de una alerta
   * PATCH /api/alerts/{alert_id}
   * @param {number} alertId - ID de la alerta
   * @param {string} newStatus - Nuevo estado: pendiente, revisada, resuelta
   * @returns {Promise<{success: boolean, message: string, alert: Object}>}
   */
  updateStatus: async (alertId, newStatus) => {
    return fetchAPI(`/api/alerts/${alertId}`, {
      method: "PATCH",
      body: JSON.stringify({ estado: newStatus }),
    });
  },
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Obtiene el color de severidad para UI
 * @param {string} severidad - critica, alta, media, baja
 * @returns {string} Clase de color
 */
export const getSeverityColor = (severidad) => {
  const colors = {
    critica: "text-error bg-error/10 border-error",
    alta: "text-warning bg-warning/10 border-warning",
    media: "text-secondary bg-secondary/10 border-secondary",
    baja: "text-success bg-success/10 border-success",
  };
  return colors[severidad] || colors.media;
};

/**
 * Obtiene el label en español de severidad
 * @param {string} severidad - critica, alta, media, baja
 * @returns {string} Label en español
 */
export const getSeverityLabel = (severidad) => {
  const labels = {
    critica: "Crítica",
    alta: "Alta",
    media: "Media",
    baja: "Baja",
  };
  return labels[severidad] || severidad;
};

/**
 * Obtiene el color de estado para UI
 * @param {string} estado - pendiente, revisada, resuelta
 * @returns {string} Clase de color
 */
export const getStatusColor = (estado) => {
  const colors = {
    pendiente: "text-error bg-error/10 border-error",
    revisada: "text-warning bg-warning/10 border-warning",
    resuelta: "text-success bg-success/10 border-success",
  };
  return colors[estado] || colors.pendiente;
};

/**
 * Obtiene el label en español de estado
 * @param {string} estado - pendiente, revisada, resuelta
 * @returns {string} Label en español
 */
export const getStatusLabel = (estado) => {
  const labels = {
    pendiente: "Pendiente",
    revisada: "Revisada",
    resuelta: "Resuelta",
  };
  return labels[estado] || estado;
};

/**
 * Formatea una fecha ISO a formato legible
 * @param {string} dateString - Fecha en formato "YYYY-MM-DD HH:MM"
 * @returns {string} Fecha formateada
 */
export const formatAlertDate = (dateString) => {
  try {
    const date = new Date(dateString.replace(" ", "T"));
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
};

export default alertsAPI;
