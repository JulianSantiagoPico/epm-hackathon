import { useState, useEffect, useMemo, useCallback } from "react";
import { Bell, AlertCircle, Send } from "lucide-react";
import Swal from "sweetalert2";
import AlertCard from "../components/ui/AlertCard";
import AlertsTable from "../components/ui/AlertsTable";
import AlertStatsCard from "../components/ui/AlertStatsCard";
import AlertEvolutionChart from "../components/charts/AlertEvolutionChart";
import { alertsAPI } from "../services/alertsService";
import { useUserStore } from "../stores/userStore";
import { ROLES } from "../utils/constants";

export default function Alerts() {
  const { currentRole } = useUserStore();
  const [viewMode, setViewMode] = useState("table"); // 'cards' o 'table'
  const [filters, setFilters] = useState({
    estado: "todos",
    severidad: "todas",
    tipo: "todos",
    valvula: "",
  });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar alertas desde la API (memoizado)
  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await alertsAPI.getAll();
      setAlerts(data.alertas || []);
    } catch (err) {
      console.error("Error al cargar alertas:", err);
      setError("Error al cargar las alertas. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  // Mock fallback para desarrollo (memoizado)
  const mockAlerts = useMemo(
    () => [
      {
        id: 1,
        fecha: "2025-08-15 14:30",
        valvula: "V-402",
        ubicacion: "Sector Norte",
        tipo: "Desbalance",
        severidad: "critica",
        descripcion:
          "Índice de pérdidas superó el umbral crítico del 12%. Se detectó desbalance significativo entre volumen de entrada y salida.",
        estado: "pendiente",
        metricas: { indicePerdidas: 14.2, volumenPerdido: 1850, umbral: 12 },
      },
      {
        id: 2,
        fecha: "2025-08-14 09:15",
        valvula: "V-318",
        ubicacion: "Sector Centro",
        tipo: "Anomalía",
        severidad: "alta",
        descripcion:
          "Detección de patrón anómalo en consumo. Desviación del 25% respecto al comportamiento esperado.",
        estado: "revisada",
        metricas: { desviacion: 25, volumenPerdido: 980 },
      },
      {
        id: 3,
        fecha: "2025-08-14 07:45",
        valvula: "V-125",
        ubicacion: "Sector Sur",
        tipo: "Desbalance",
        severidad: "alta",
        descripcion:
          "Pérdidas superiores al promedio histórico. Índice de pérdidas en 11.8%.",
        estado: "resuelta",
        metricas: { indicePerdidas: 11.8, volumenPerdido: 1420 },
      },
      {
        id: 4,
        fecha: "2025-08-13 16:20",
        valvula: "V-567",
        ubicacion: "Sector Este",
        tipo: "Anomalía",
        severidad: "media",
        descripcion:
          "Comportamiento atípico detectado en mediciones nocturnas. Variación inesperada del 18%.",
        estado: "pendiente",
        metricas: { desviacion: 18, volumenPerdido: 650 },
      },
      {
        id: 5,
        fecha: "2025-08-13 11:30",
        valvula: "V-089",
        ubicacion: "Sector Oeste",
        tipo: "Desbalance",
        severidad: "media",
        descripcion:
          "Índice de pérdidas ligeramente por encima del promedio (9.5%). Requiere seguimiento.",
        estado: "revisada",
        metricas: { indicePerdidas: 9.5, volumenPerdido: 780 },
      },
      {
        id: 6,
        fecha: "2025-08-12 19:00",
        valvula: "V-402",
        ubicacion: "Sector Norte",
        tipo: "Anomalía",
        severidad: "baja",
        descripcion:
          "Pequeña desviación detectada en horario valle. Posible ajuste de demanda.",
        estado: "resuelta",
        metricas: { desviacion: 8, volumenPerdido: 320 },
      },
      {
        id: 7,
        fecha: "2025-08-12 14:15",
        valvula: "V-318",
        ubicacion: "Sector Centro",
        tipo: "Desbalance",
        severidad: "critica",
        descripcion:
          "Pérdidas críticas detectadas. Índice del 15.3%. Requiere intervención inmediata.",
        estado: "pendiente",
        metricas: { indicePerdidas: 15.3, volumenPerdido: 2100, umbral: 12 },
      },
      {
        id: 8,
        fecha: "2025-08-11 10:45",
        valvula: "V-125",
        ubicacion: "Sector Sur",
        tipo: "Anomalía",
        severidad: "alta",
        descripcion:
          "Patrón de consumo fuera de lo normal. Desviación del 22% respecto a predicción.",
        estado: "revisada",
        metricas: { desviacion: 22, volumenPerdido: 1150 },
      },
    ],
    []
  );

  // Usar alertas reales o fallback (memoizado)
  const displayAlerts = useMemo(
    () => (alerts.length > 0 ? alerts : mockAlerts),
    [alerts, mockAlerts]
  );

  // Filtrar alertas (memoizado)
  const filteredAlerts = useMemo(() => {
    return displayAlerts.filter((alert) => {
      if (filters.estado !== "todos" && alert.estado !== filters.estado)
        return false;
      if (
        filters.severidad !== "todas" &&
        alert.severidad !== filters.severidad
      )
        return false;
      if (filters.tipo !== "todos" && alert.tipo !== filters.tipo) return false;
      if (
        filters.valvula &&
        !alert.valvula.toLowerCase().includes(filters.valvula.toLowerCase())
      )
        return false;
      return true;
    });
  }, [displayAlerts, filters]);

  // Calcular estadísticas (memoizado)
  const stats = useMemo(
    () => ({
      pendientes: displayAlerts.filter((a) => a.estado === "pendiente").length,
      revisadas: displayAlerts.filter((a) => a.estado === "revisada").length,
      resueltas: displayAlerts.filter((a) => a.estado === "resuelta").length,
      total: displayAlerts.length,
      criticas: displayAlerts.filter((a) => a.severidad === "critica").length,
      altas: displayAlerts.filter((a) => a.severidad === "alta").length,
      medias: displayAlerts.filter((a) => a.severidad === "media").length,
      bajas: displayAlerts.filter((a) => a.severidad === "baja").length,
    }),
    [displayAlerts]
  );

  // Actualizar estado de alerta (memoizado)
  const handleUpdateStatus = useCallback(
    async (alertId, newStatus) => {
      try {
        // Actualizar en la API
        const response = await alertsAPI.updateStatus(alertId, newStatus);

        if (response.success) {
          // Actualizar estado local
          setAlerts(
            alerts.map((alert) =>
              alert.id === alertId ? { ...alert, estado: newStatus } : alert
            )
          );

          // Notificación de éxito
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: "success",
            title: "Estado actualizado correctamente",
          });
        }
      } catch (err) {
        console.error("Error al actualizar estado:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el estado de la alerta",
          confirmButtonColor: "#0088cc",
        });
      }
    },
    [alerts]
  );

  // Cambiar filtro (memoizado)
  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
  }, []);

  return (
    <div className="min-h-screen bg-backgroundSecondary">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="p-6 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-textMain">
                Gestión de Alertas
              </h1>
            </div>
            <p className="text-textSecondary">
              Monitoreo y gestión de alertas del sistema de balance de gas
            </p>
          </div>

          {currentRole === ROLES.OPERATOR && (
            <a
              href="https://t.me/BALANCIAOPE_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#0088cc] text-white rounded-lg font-medium hover:bg-[#0077b5] transition-colors shadow-sm"
            >
              <Send className="w-5 h-5" />
              Ir al Bot de Telegram
            </a>
          )}
        </div>
        {error && (
          <div className="px-6 pb-4">
            <div className="p-3 bg-error/10 border border-error rounded-lg text-error text-sm">
              {error}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {!loading && (
          <>
            {/* Estadísticas */}
            <section>
              <AlertStatsCard stats={stats} />
            </section>

            {/* Gráfico de Evolución */}
            <section>
              <AlertEvolutionChart />
            </section>

            {/* Selector de vista */}
            <section className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-textSecondary" />
                <h2 className="text-xl font-semibold text-textMain">
                  Alertas Recientes
                </h2>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
                  {filteredAlerts.length}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === "cards"
                      ? "bg-primary text-white"
                      : "bg-white text-textSecondary border border-border hover:bg-backgroundSecondary"
                  }`}
                >
                  Vista Tarjetas
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === "table"
                      ? "bg-primary text-white"
                      : "bg-white text-textSecondary border border-border hover:bg-backgroundSecondary"
                  }`}
                >
                  Vista Tabla
                </button>
              </div>
            </section>

            {/* Contenido según vista seleccionada */}
            {viewMode === "table" ? (
              <AlertsTable
                alerts={filteredAlerts}
                onUpdateStatus={handleUpdateStatus}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            ) : (
              <div className="space-y-4">
                {/* Filtros para vista de tarjetas */}
                <div className="bg-white rounded-lg shadow-md p-4 border border-border">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select
                      value={filters.estado}
                      onChange={(e) =>
                        handleFilterChange("estado", e.target.value)
                      }
                      className="px-3 py-2 border border-border rounded-lg text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="todos">Todos los estados</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="revisada">Revisada</option>
                      <option value="resuelta">Resuelta</option>
                    </select>

                    <select
                      value={filters.severidad}
                      onChange={(e) =>
                        handleFilterChange("severidad", e.target.value)
                      }
                      className="px-3 py-2 border border-border rounded-lg text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="todas">Todas las severidades</option>
                      <option value="critica">Crítica</option>
                      <option value="alta">Alta</option>
                      <option value="media">Media</option>
                      <option value="baja">Baja</option>
                    </select>

                    <select
                      value={filters.tipo}
                      onChange={(e) =>
                        handleFilterChange("tipo", e.target.value)
                      }
                      className="px-3 py-2 border border-border rounded-lg text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="todos">Todos los tipos</option>
                      <option value="Desbalance">Desbalance</option>
                      <option value="Anomalía">Anomalía</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Filtrar por válvula..."
                      value={filters.valvula}
                      onChange={(e) =>
                        handleFilterChange("valvula", e.target.value)
                      }
                      className="px-3 py-2 border border-border rounded-lg text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Grid de tarjetas */}
                {filteredAlerts.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-12 border border-border text-center">
                    <AlertCircle className="w-16 h-16 text-textSecondary mx-auto mb-4" />
                    <p className="text-lg font-semibold text-textMain mb-2">
                      No hay alertas
                    </p>
                    <p className="text-sm text-textSecondary">
                      No se encontraron alertas con los filtros seleccionados
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredAlerts.map((alert) => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        onUpdateStatus={handleUpdateStatus}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
