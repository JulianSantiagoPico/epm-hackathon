import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  XCircle,
  Info,
  AlertCircle,
} from "lucide-react";

export default function AlertStatsCard({ stats }) {
  const statCards = [
    {
      title: "Pendientes",
      value: stats.pendientes,
      icon: AlertTriangle,
      color: "error",
      bgColor: "bg-error/10",
      textColor: "text-error",
    },
    {
      title: "Revisadas",
      value: stats.revisadas,
      icon: Eye,
      color: "warning",
      bgColor: "bg-warning/10",
      textColor: "text-warning",
    },
    {
      title: "Resueltas",
      value: stats.resueltas,
      icon: CheckCircle2,
      color: "success",
      bgColor: "bg-success/10",
      textColor: "text-success",
    },
    {
      title: "Total",
      value: stats.total,
      icon: Clock,
      color: "primary",
      bgColor: "bg-primary/10",
      textColor: "text-primary",
    },
  ];

  const severityCards = [
    {
      title: "Críticas",
      value: stats.criticas,
      icon: XCircle,
      color: "error",
      bgColor: "bg-error/10",
      textColor: "text-error",
    },
    {
      title: "Altas",
      value: stats.altas,
      icon: AlertTriangle,
      color: "warning",
      bgColor: "bg-warning/10",
      textColor: "text-warning",
    },
    {
      title: "Medias",
      value: stats.medias,
      icon: AlertCircle,
      color: "warning",
      bgColor: "bg-warning/5",
      textColor: "text-warning",
    },
    {
      title: "Bajas",
      value: stats.bajas,
      icon: Info,
      color: "success",
      bgColor: "bg-success/10",
      textColor: "text-success",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-textMain">
          Resumen de Alertas
        </h3>
        <p className="text-sm text-textSecondary">
          Estado actual y distribución por severidad
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Estados */}
        <div>
          <h3 className="text-sm font-semibold text-textSecondary mb-3">
            Por Estado
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className={`${stat.bgColor} rounded-lg p-4 border border-${stat.color}/20`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${stat.textColor}`} />
                  </div>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-textSecondary mt-1">
                    {stat.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Severidad */}
        <div>
          <h3 className="text-sm font-semibold text-textSecondary mb-3">
            Por Severidad
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {severityCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className={`${stat.bgColor} rounded-lg p-4 border border-${
                    stat.color === "yellow-600"
                      ? "yellow-500"
                      : stat.color + "/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${stat.textColor}`} />
                  </div>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-textSecondary mt-1">
                    {stat.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
