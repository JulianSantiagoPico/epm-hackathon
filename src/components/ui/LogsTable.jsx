import { FileText, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function LogsTable({ logs = [] }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "error":
        return <XCircle className="w-5 h-5 text-error" />;
      case "pending":
        return <Clock className="w-5 h-5 text-warning" />;
      default:
        return <Clock className="w-5 h-5 text-textSecondary" />;
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      success: "bg-success/10 text-success",
      error: "bg-error/10 text-error",
      pending: "bg-warning/10 text-warning",
    };

    return config[status] || config.pending;
  };

  // Mock data si no hay logs
  const displayLogs =
    logs.length > 0
      ? logs
      : [
          {
            id: 1,
            date: "2025-12-02 10:30",
            action: "Carga de datos",
            type: "Macromedición",
            status: "success",
            details: "15,240 registros cargados",
          },
          {
            id: 2,
            date: "2025-12-02 09:15",
            action: "Reentrenamiento",
            type: "Modelo XGBoost",
            status: "success",
            details: "MAE: 0.042, RMSE: 0.068",
          },
          {
            id: 3,
            date: "2025-12-01 16:45",
            action: "Carga de datos",
            type: "Usuarios",
            status: "error",
            details: "Error en validación de columnas",
          },
        ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-textMain">
              Historial de Operaciones
            </h3>
            <p className="text-sm text-textSecondary">
              Últimas acciones realizadas en el sistema
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-backgroundSecondary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Acción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Detalles
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayLogs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-backgroundSecondary transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-textMain">
                  {log.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-textMain">
                  {log.action}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                  {log.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    <span
                      className={`
                      text-xs font-medium px-2 py-1 rounded-full
                      ${getStatusBadge(log.status)}
                    `}
                    >
                      {log.status === "success"
                        ? "Exitoso"
                        : log.status === "error"
                        ? "Error"
                        : "Pendiente"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-textSecondary">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {displayLogs.length === 0 && (
        <div className="p-8 text-center">
          <FileText className="w-12 h-12 text-textSecondary mx-auto mb-3 opacity-50" />
          <p className="text-sm text-textSecondary">
            No hay operaciones registradas
          </p>
        </div>
      )}
    </div>
  );
}
