import { Activity, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export default function SystemHealthIndicator({
  healthScore = 85,
  issues = [],
  bestModel = null,
  reliabilityData = null,
}) {
  const getHealthStatus = (score) => {
    if (score >= 80)
      return {
        label: "Excelente",
        color: "text-success",
        bgColor: "bg-success",
        icon: CheckCircle2,
      };
    if (score >= 60)
      return {
        label: "Bueno",
        color: "text-warning",
        bgColor: "bg-warning",
        icon: AlertTriangle,
      };
    return {
      label: "Crítico",
      color: "text-error",
      bgColor: "bg-error",
      icon: XCircle,
    };
  };

  const status = getHealthStatus(healthScore);
  const StatusIcon = status.icon;

  // Calcular issues desde reliability data si está disponible
  const displayIssues = issues.length > 0 
    ? issues
    : reliabilityData?.valves
    ? [
        {
          type: "success",
          count: reliabilityData.valves.filter(v => v.nivel === "ALTA").length,
          label: "Válvulas operando normalmente",
        },
        {
          type: "warning",
          count: reliabilityData.valves.filter(v => v.nivel === "MEDIA-ALTA").length,
          label: "Válvulas requieren monitoreo",
        },
        {
          type: "error",
          count: reliabilityData.valves.filter(v => v.score < 70).length,
          label: "Válvulas en estado crítico",
        },
      ]
    : [
        { type: "success", count: 42, label: "Válvulas operando normalmente" },
        { type: "warning", count: 3, label: "Válvulas requieren monitoreo" },
        { type: "error", count: 2, label: "Válvulas en estado crítico" },
      ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-lg font-semibold text-textMain">
            Estado del Sistema
          </h3>
          <p className="text-sm text-textSecondary">Salud general de la red</p>
        </div>
      </div>

      {/* Indicador circular */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-40 h-40">
          {/* Círculo de fondo */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#E0E0E0"
              strokeWidth="12"
              fill="none"
            />
            {/* Círculo de progreso */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - healthScore / 100)}`}
              className={status.color}
              strokeLinecap="round"
            />
          </svg>

          {/* Contenido central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <StatusIcon className={`w-10 h-10 mb-2 ${status.color}`} />
            <p className="text-3xl font-bold text-textMain">{healthScore}%</p>
            <p className={`text-sm font-medium ${status.color}`}>
              {status.label}
            </p>
          </div>
        </div>
      </div>

      {/* Resumen de issues */}
      <div className="space-y-3">
        {displayIssues.map((issue, index) => {
          const issueColors = {
            success: "text-success bg-success/10",
            warning: "text-warning bg-warning/10",
            error: "text-error bg-error/10",
          };

          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-backgroundSecondary"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    issueColors[issue.type]?.replace("bg-", "bg-").split("/")[0]
                  }`}
                />
                <span className="text-sm text-textSecondary">
                  {issue.label}
                </span>
              </div>
              <span
                className={`text-sm font-bold px-2 py-1 rounded ${
                  issueColors[issue.type]
                }`}
              >
                {issue.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mejor Modelo Info */}
      {bestModel && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-textSecondary">Modelo Principal:</span>
            <span className="text-sm font-semibold text-primary">{bestModel}</span>
          </div>
        </div>
      )}
    </div>
  );
}
