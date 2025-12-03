import {
  FileCheck,
  Calendar,
  Database,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function DataStatusCard({
  type,
  lastUpdate,
  recordCount,
  status,
}) {
  const typeConfig = {
    macromeasurement: {
      label: "Macromedición",
      icon: Database,
      color: "text-primary",
    },
    users: {
      label: "Usuarios",
      icon: FileCheck,
      color: "text-secondary",
    },
    balances: {
      label: "Balances",
      icon: Database,
      color: "text-accent",
    },
  };

  const config = typeConfig[type] || typeConfig.macromeasurement;
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg bg-backgroundSecondary ${config.color}`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-textMain">
              {config.label}
            </h3>
            <p className="text-sm text-textSecondary">Estado de datos</p>
          </div>
        </div>

        {status === "success" ? (
          <CheckCircle2 className="w-5 h-5 text-success" />
        ) : (
          <AlertCircle className="w-5 h-5 text-warning" />
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-border">
          <span className="text-sm text-textSecondary flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Última actualización
          </span>
          <span className="text-sm font-medium text-textMain">
            {lastUpdate || "Sin datos"}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-textSecondary flex items-center gap-2">
            <Database className="w-4 h-4" />
            Registros cargados
          </span>
          <span className="text-sm font-medium text-textMain">
            {recordCount ? recordCount.toLocaleString() : "0"}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div
          className={`
          text-xs font-medium px-3 py-1 rounded-full inline-block
          ${
            status === "success"
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          }
        `}
        >
          {status === "success"
            ? "✓ Validación exitosa"
            : "⚠ Pendiente de carga"}
        </div>
      </div>
    </div>
  );
}
