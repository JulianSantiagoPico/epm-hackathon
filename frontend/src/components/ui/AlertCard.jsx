import { AlertTriangle, CheckCircle2, Clock, Eye } from "lucide-react";

export default function AlertCard({ alert, onUpdateStatus }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critica":
        return "bg-error/10 border-error text-error";
      case "alta":
        return "bg-warning/10 border-warning text-warning";
      case "media":
        return "bg-yellow-100 border-yellow-500 text-yellow-700";
      case "baja":
        return "bg-success/10 border-success text-success";
      default:
        return "bg-gray-100 border-gray-500 text-gray-700";
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "pendiente":
        return {
          icon: AlertTriangle,
          color: "text-error",
          bg: "bg-error/10",
          label: "Pendiente",
        };
      case "revisada":
        return {
          icon: Eye,
          color: "text-warning",
          bg: "bg-warning/10",
          label: "Revisada",
        };
      case "resuelta":
        return {
          icon: CheckCircle2,
          color: "text-success",
          bg: "bg-success/10",
          label: "Resuelta",
        };
      default:
        return {
          icon: Clock,
          color: "text-textSecondary",
          bg: "bg-gray-100",
          label: "Desconocido",
        };
    }
  };

  const statusInfo = getStatusInfo(alert.estado);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-lg shadow-md border border-border p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold border ${getSeverityColor(
                alert.severidad
              )}`}
            >
              {alert.severidad.toUpperCase()}
            </span>
            <span className="px-2 py-1 rounded text-xs font-medium bg-backgroundSecondary text-textSecondary">
              {alert.tipo}
            </span>
          </div>
          <h4 className="text-xl font-bold text-textMain mb-1">
            Válvula {alert.valvula}
          </h4>
          <p className="text-sm text-textSecondary">{alert.ubicacion}</p>
        </div>
        <div
          className={`flex items-center gap-1 px-3 py-1 rounded-full ${statusInfo.bg}`}
        >
          <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
          <span className={`text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Descripción */}
      <p className="text-sm text-textMain mb-4 leading-relaxed">
        {alert.descripcion}
      </p>

      {/* Métricas */}
      {alert.metricas && (
        <div className="space-y-3 mb-4">
          {alert.metricas.indicePerdidas && (
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-textSecondary">
                Índice de pérdidas
              </span>
              <span className="text-sm font-bold text-error">
                {alert.metricas.indicePerdidas}%
              </span>
            </div>
          )}
          {alert.metricas.desviacion && (
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-textSecondary">Desviación</span>
              <span className="text-sm font-bold text-warning">
                {alert.metricas.desviacion}%
              </span>
            </div>
          )}
          {alert.metricas.volumenPerdido && (
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-textSecondary">
                Volumen perdido
              </span>
              <span className="text-sm font-bold text-textMain">
                {alert.metricas.volumenPerdido} m³
              </span>
            </div>
          )}
          {alert.metricas.umbral && (
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-textSecondary">
                Umbral excedido
              </span>
              <span className="text-sm font-bold text-error">
                {alert.metricas.umbral}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1 text-xs text-textSecondary">
          <Clock className="w-3 h-3" />
          <span>{alert.fecha}</span>
        </div>

        {/* Acciones */}
        {alert.estado !== "resuelta" && (
          <div className="flex gap-2">
            {alert.estado === "pendiente" && (
              <button
                onClick={() => onUpdateStatus(alert.id, "revisada")}
                className="px-3 py-1 text-xs font-medium bg-warning/10 text-warning rounded hover:bg-warning/20 transition-colors"
              >
                Marcar Revisada
              </button>
            )}
            <button
              onClick={() => onUpdateStatus(alert.id, "resuelta")}
              className="px-3 py-1 text-xs font-medium bg-success/10 text-success rounded hover:bg-success/20 transition-colors"
            >
              Resolver
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
