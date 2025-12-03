import { AlertTriangle, TrendingUp } from "lucide-react";

export default function TopValvesTable({ valves = [] }) {
  // Mock data si no hay válvulas
  const displayValves =
    valves.length > 0
      ? valves
      : [
          {
            id: "V-402",
            name: "Válvula Anillo 402",
            lossIndex: 15.3,
            status: "critical",
            trend: "up",
          },
          {
            id: "V-318",
            name: "Válvula Anillo 318",
            lossIndex: 12.8,
            status: "warning",
            trend: "up",
          },
          {
            id: "V-125",
            name: "Válvula Anillo 125",
            lossIndex: 11.5,
            status: "warning",
            trend: "down",
          },
          {
            id: "V-567",
            name: "Válvula Anillo 567",
            lossIndex: 10.2,
            status: "normal",
            trend: "stable",
          },
          {
            id: "V-089",
            name: "Válvula Anillo 089",
            lossIndex: 9.8,
            status: "normal",
            trend: "down",
          },
        ];

  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "bg-error/10 text-error";
      case "warning":
        return "bg-warning/10 text-warning";
      default:
        return "bg-success/10 text-success";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "critical":
        return "Crítico";
      case "warning":
        return "Advertencia";
      default:
        return "Normal";
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-error" />;
    if (trend === "down")
      return <TrendingUp className="w-4 h-4 text-success rotate-180" />;
    return <span className="text-textSecondary text-xs">—</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-warning" />
          <div>
            <h3 className="text-lg font-semibold text-textMain">
              Top 5 Válvulas con Mayor Pérdida
            </h3>
            <p className="text-sm text-textSecondary">
              Puntos críticos que requieren atención
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-backgroundSecondary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Ranking
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                ID Válvula
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Índice de Pérdidas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Tendencia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayValves.map((valve, index) => (
              <tr
                key={valve.id}
                className="hover:bg-backgroundSecondary transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-textMain">
                  {valve.id}
                </td>
                <td className="px-6 py-4 text-sm text-textSecondary">
                  {valve.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-backgroundSecondary rounded-full h-2 max-w-[100px]">
                      <div
                        className={`h-2 rounded-full ${
                          valve.lossIndex > 12
                            ? "bg-error"
                            : valve.lossIndex > 10
                            ? "bg-warning"
                            : "bg-success"
                        }`}
                        style={{
                          width: `${Math.min(valve.lossIndex * 5, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold text-textMain min-w-[50px]">
                      {valve.lossIndex.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTrendIcon(valve.trend)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                      valve.status
                    )}`}
                  >
                    {getStatusLabel(valve.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
