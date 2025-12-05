import { memo } from "react";
import { AlertTriangle, CheckCircle2, Eye, Filter } from "lucide-react";

const AlertsTable = memo(function AlertsTable({
  alerts,
  onUpdateStatus,
  filters,
  onFilterChange,
}) {
  const getSeverityBadge = (severity) => {
    const styles = {
      critica: "bg-error/10 text-error border-error",
      alta: "bg-warning/10 text-warning border-warning",
      media: "bg-yellow-100 text-yellow-700 border-yellow-500",
      baja: "bg-success/10 text-success border-success",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-semibold border ${styles[severity]}`}
      >
        {severity.toUpperCase()}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      pendiente: {
        icon: AlertTriangle,
        color: "text-error",
        bg: "bg-error/10",
        label: "Pendiente",
      },
      revisada: {
        icon: Eye,
        color: "text-warning",
        bg: "bg-warning/10",
        label: "Revisada",
      },
      resuelta: {
        icon: CheckCircle2,
        color: "text-success",
        bg: "bg-success/10",
        label: "Resuelta",
      },
    };
    const style = styles[status];
    const Icon = style.icon;

    return (
      <span
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${style.bg} ${style.color} w-fit`}
      >
        <Icon className="w-3 h-3" />
        {style.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-border overflow-hidden">
      {/* Filtros */}
      <div className="p-4 bg-backgroundSecondary border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-textSecondary" />
          <h3 className="text-sm font-semibold text-textMain">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Filtro Estado */}
          <select
            value={filters.estado}
            onChange={(e) => onFilterChange("estado", e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="revisada">Revisada</option>
            <option value="resuelta">Resuelta</option>
          </select>

          {/* Filtro Severidad */}
          <select
            value={filters.severidad}
            onChange={(e) => onFilterChange("severidad", e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="todas">Todas las severidades</option>
            <option value="critica">Crítica</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>

          {/* Filtro Tipo */}
          <select
            value={filters.tipo}
            onChange={(e) => onFilterChange("tipo", e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="todos">Todos los tipos</option>
            <option value="Desbalance">Desbalance</option>
            <option value="Anomalía">Anomalía</option>
          </select>

          {/* Filtro Válvula */}
          <input
            type="text"
            placeholder="Filtrar por válvula..."
            value={filters.valvula}
            onChange={(e) => onFilterChange("valvula", e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-backgroundSecondary">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Válvula
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Severidad
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {alerts.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-8 text-center text-sm text-textSecondary"
                >
                  No se encontraron alertas con los filtros seleccionados
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="hover:bg-backgroundSecondary/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-textSecondary whitespace-nowrap">
                    {alert.fecha}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-textMain">
                        {alert.valvula}
                      </p>
                      <p className="text-xs text-textSecondary">
                        {alert.ubicacion}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-backgroundSecondary text-textSecondary">
                      {alert.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getSeverityBadge(alert.severidad)}
                  </td>
                  <td className="px-4 py-3 text-sm text-textMain max-w-xs truncate">
                    {alert.descripcion}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(alert.estado)}</td>
                  <td className="px-4 py-3">
                    {alert.estado !== "resuelta" && (
                      <div className="flex gap-2">
                        {alert.estado === "pendiente" && (
                          <button
                            onClick={() => onUpdateStatus(alert.id, "revisada")}
                            className="px-2 py-1 text-xs font-medium bg-warning/10 text-warning rounded hover:bg-warning/20 transition-colors"
                          >
                            Revisar
                          </button>
                        )}
                        <button
                          onClick={() => onUpdateStatus(alert.id, "resuelta")}
                          className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded hover:bg-success/20 transition-colors"
                        >
                          Resolver
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con resumen */}
      {alerts.length > 0 && (
        <div className="px-4 py-3 bg-backgroundSecondary border-t border-border">
          <p className="text-xs text-textSecondary">
            Mostrando{" "}
            <span className="font-semibold text-textMain">{alerts.length}</span>{" "}
            alertas
          </p>
        </div>
      )}
    </div>
  );
});

export default AlertsTable;
