/**
 * Servicio API para consumir el backend de FastAPI
 * Base URL: http://localhost:8000
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
      const error = await response.json();
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// ==================== DASHBOARD API ====================

export const dashboardAPI = {
  /**
   * Obtener KPIs principales
   * GET /api/dashboard/kpis
   */
  getKPIs: async () => {
    return fetchAPI("/api/dashboard/kpis");
  },

  /**
   * Obtener evolución del índice de pérdidas
   * GET /api/dashboard/loss-index-evolution
   * @param {string} valvulaId - Opcional: ID de válvula para filtrar
   */
  getLossIndexEvolution: async (valvulaId = null) => {
    const params = valvulaId ? `?valvula_id=${valvulaId}` : "";
    return fetchAPI(`/api/dashboard/loss-index-evolution${params}`);
  },

  /**
   * Obtener top válvulas con mayores desbalances
   * GET /api/dashboard/top-valves
   * @param {number} limit - Cantidad de válvulas (default: 5)
   */
  getTopValves: async (limit = 5) => {
    return fetchAPI(`/api/dashboard/top-valves?limit=${limit}`);
  },

  /**
   * Obtener resumen completo del dashboard (todo en una llamada)
   * GET /api/dashboard/summary
   */
  getSummary: async () => {
    return fetchAPI("/api/dashboard/summary");
  },

  /**
   * Obtener estado de todas las válvulas
   * GET /api/dashboard/valves-status
   */
  getValvesStatus: async () => {
    return fetchAPI("/api/dashboard/valves-status");
  },
};

// ==================== BALANCES API ====================

export const balancesAPI = {
  /**
   * Obtener balances por válvula
   * GET /api/balances/{valvula_id}
   * @param {string} valvulaId - ID de la válvula (ej: VALVULA_1)
   * @param {string} periodoInicio - Opcional: Formato YYYYMM (ej: 202407)
   * @param {string} periodoFin - Opcional: Formato YYYYMM
   */
  getByValve: async (valvulaId, periodoInicio = null, periodoFin = null) => {
    let params = [];
    if (periodoInicio) params.push(`periodo_inicio=${periodoInicio}`);
    if (periodoFin) params.push(`periodo_fin=${periodoFin}`);
    const query = params.length > 0 ? `?${params.join("&")}` : "";

    return fetchAPI(`/api/balances/${valvulaId}${query}`);
  },

  /**
   * Listar todas las válvulas disponibles
   * GET /api/balances/
   */
  listValves: async () => {
    return fetchAPI("/api/balances/");
  },

  /**
   * Obtener períodos disponibles para una válvula
   * GET /api/balances/{valvula_id}/periodos
   * @param {string} valvulaId - ID de la válvula
   */
  getPeriodos: async (valvulaId) => {
    return fetchAPI(`/api/balances/${valvulaId}/periodos`);
  },

  /**
   * Analizar balances con IA
   * POST /api/balances/{valvula_id}/analyze
   * @param {string} valvulaId - ID de la válvula
   */
  analyze: async (valvulaId) => {
    return fetchAPI(`/api/balances/${valvulaId}/analyze`, {
      method: "POST",
    });
  },
};

// ==================== MODELS API (próximamente) ====================

export const modelsAPI = {
  /**
   * Obtener métricas de modelos
   * GET /api/models/metrics
   */
  getMetrics: async (valvulaId = null) => {
    const params = valvulaId ? `?valvula_id=${valvulaId}` : "";
    return fetchAPI(`/api/models/metrics${params}`);
  },

  /**
   * Obtener comparación de modelos
   * GET /api/models/comparison
   */
  getComparison: async (metric = "mae", valvulaId = null) => {
    let params = [`metric=${metric}`];
    if (valvulaId) params.push(`valvula_id=${valvulaId}`);
    return fetchAPI(`/api/models/comparison?${params.join("&")}`);
  },

  /**
   * Obtener mejor modelo
   * GET /api/models/best
   */
  getBest: async (metric = "mae") => {
    return fetchAPI(`/api/models/best?metric=${metric}`);
  },

  /**
   * Obtener mejor modelo por válvula
   * GET /api/models/best-by-valve
   */
  getBestByValve: async (metric = "mae") => {
    return fetchAPI(`/api/models/best-by-valve?metric=${metric}`);
  },

  /**
   * Obtener modelos disponibles
   * GET /api/models/available
   */
  getAvailable: async () => {
    return fetchAPI("/api/models/available");
  },

  /**
   * Obtener datos de scatter plot (real vs predicho)
   * GET /api/models/predictions-scatter
   * @param {string} modelo - Nombre del modelo (LightGBM, CatBoost, RandomForest)
   * @param {string} valvulaId - Opcional: ID de válvula
   */
  getPredictionsScatter: async (modelo, valvulaId = null) => {
    let params = [`modelo=${encodeURIComponent(modelo)}`];
    if (valvulaId) params.push(`valvula_id=${encodeURIComponent(valvulaId)}`);
    return fetchAPI(`/api/models/predictions-scatter?${params.join("&")}`);
  },

  /**
   * Obtener detalles técnicos de un modelo
   * GET /api/models/{model_id}/details
   * @param {string} modelId - ID del modelo (lightgbm, catboost, randomforest, xgboost, prophet)
   * @param {string} valvulaId - Opcional: ID de válvula
   */
  getModelDetails: async (modelId, valvulaId = null) => {
    const params = valvulaId ? `?valvula_id=${valvulaId}` : "";
    return fetchAPI(`/api/models/${modelId}/details${params}`);
  },
};

// ==================== CORRELATIONS API ====================

export const correlationsAPI = {
  /**
   * Obtener matriz de correlación
   * GET /api/correlations/matrix
   */
  getMatrix: async () => {
    return fetchAPI("/api/correlations/matrix");
  },

  /**
   * Obtener top correlaciones
   * GET /api/correlations/top
   * @param {number} limit - Cantidad de correlaciones a retornar (default: 5)
   */
  getTopCorrelations: async (limit = 5) => {
    return fetchAPI(`/api/correlations/top?limit=${limit}`);
  },

  /**
   * Obtener correlaciones de una variable específica
   * GET /api/correlations/variable/{variable_name}
   * @param {string} variableName - Nombre de la variable
   */
  getVariableCorrelations: async (variableName) => {
    return fetchAPI(
      `/api/correlations/variable/${encodeURIComponent(variableName)}`
    );
  },

  /**
   * Obtener datos de scatter plot entre dos variables
   * GET /api/correlations/scatter
   * @param {string} varX - Nombre de la variable X
   * @param {string} varY - Nombre de la variable Y
   * @param {string} valvulaId - (Opcional) Filtrar por válvula específica
   */
  getScatterData: async (varX, varY, valvulaId = null) => {
    const params = new URLSearchParams({
      var_x: varX,
      var_y: varY,
    });
    if (valvulaId) {
      params.append("valvula_id", valvulaId);
    }
    return fetchAPI(`/api/correlations/scatter?${params.toString()}`);
  },
};

// ==================== ALERTS API (próximamente) ====================

export const alertsAPI = {
  /**
   * Obtener todas las alertas
   * GET /api/alerts
   */
  getAll: async () => {
    return fetchAPI("/api/alerts");
  },

  /**
   * Obtener estadísticas de alertas
   * GET /api/alerts/stats
   */
  getStats: async () => {
    return fetchAPI("/api/alerts/stats");
  },
};

// ==================== RELIABILITY API ====================

export const reliabilityAPI = {
  /**
   * Obtener scores de confiabilidad de todas las válvulas
   * GET /api/reliability/
   */
  getAll: async (valvulaId = null) => {
    const params = valvulaId ? `?valvula_id=${valvulaId}` : "";
    return fetchAPI(`/api/reliability/${params}`);
  },

  /**
   * Obtener score de confiabilidad de una válvula
   * GET /api/reliability/{valvula_id}
   */
  getByValve: async (valvulaId) => {
    return fetchAPI(`/api/reliability/${valvulaId}`);
  },
};

// ==================== BENCHMARK API ====================

export const benchmarkAPI = {
  /**
   * Obtener comparación histórico vs pronóstico
   * GET /api/benchmark/historic-vs-forecast
   */
  getHistoricVsForecast: async (valvulaId = null) => {
    const params = valvulaId ? `?valvula_id=${valvulaId}` : "";
    return fetchAPI(`/api/benchmark/historic-vs-forecast${params}`);
  },

  /**
   * Obtener precisión de pronóstico por válvula
   * GET /api/benchmark/{valvula_id}/accuracy
   */
  getValveAccuracy: async (valvulaId) => {
    return fetchAPI(`/api/benchmark/${valvulaId}/accuracy`);
  },
};

// ==================== FORECAST API ====================

export const forecastAPI = {
  /**
   * Obtener resumen de pronósticos de todas las válvulas
   * GET /api/forecast/summary
   */
  getSummary: async (valvulaId = null) => {
    const params = valvulaId ? `?valvula_id=${valvulaId}` : "";
    return fetchAPI(`/api/forecast/summary${params}`);
  },

  /**
   * Obtener resumen de pronósticos de una válvula
   * GET /api/forecast/{valvula_id}/summary
   */
  getByValve: async (valvulaId) => {
    return fetchAPI(`/api/forecast/${valvulaId}/summary`);
  },
};

// ==================== HEALTH CHECK ====================

export const healthAPI = {
  /**
   * Health check básico
   * GET /
   */
  check: async () => {
    return fetchAPI("/");
  },

  /**
   * Health check con datos
   * GET /health
   */
  detailed: async () => {
    return fetchAPI("/health");
  },
};

// Exportar todo como default también
export default {
  dashboard: dashboardAPI,
  balances: balancesAPI,
  models: modelsAPI,
  correlations: correlationsAPI,
  alerts: alertsAPI,
  reliability: reliabilityAPI,
  benchmark: benchmarkAPI,
  forecast: forecastAPI,
  health: healthAPI,
};
