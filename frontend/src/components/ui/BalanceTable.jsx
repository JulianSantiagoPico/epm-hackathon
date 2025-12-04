import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function BalanceTable({ valveId, data = [] }) {
  // Mock data
  const displayData =
    data.length > 0
      ? data
      : [
          {
            month: "Enero 2025",
            entrada: 12500,
            salida: 11450,
            perdidas: 1050,
            indice: 8.4,
            tipo: "real",
          },
          {
            month: "Febrero 2025",
            entrada: 13200,
            salida: 11980,
            perdidas: 1220,
            indice: 9.2,
            tipo: "real",
          },
          {
            month: "Marzo 2025",
            entrada: 11800,
            salida: 10950,
            perdidas: 850,
            indice: 7.2,
            tipo: "real",
          },
          {
            month: "Abril 2025",
            entrada: 14100,
            salida: 12670,
            perdidas: 1430,
            indice: 10.1,
            tipo: "real",
          },
          {
            month: "Mayo 2025",
            entrada: 13500,
            salida: 12285,
            perdidas: 1215,
            indice: 9.0,
            tipo: "real",
          },
          {
            month: "Junio 2025",
            entrada: 12900,
            salida: 11738,
            perdidas: 1162,
            indice: 9.0,
            tipo: "real",
          },
          {
            month: "Julio 2025",
            entrada: 15200,
            salida: 13528,
            perdidas: 1672,
            indice: 11.0,
            tipo: "real",
          },
          {
            month: "Agosto 2025",
            entrada: 14800,
            salida: 13392,
            perdidas: 1408,
            indice: 9.5,
            tipo: "predicho",
          },
        ];

  const getIndexColor = (indice) => {
    if (indice >= 10) return "text-error";
    if (indice >= 8) return "text-warning";
    return "text-success";
  };

  const getTipoIcon = (tipo) => {
    if (tipo === "real")
      return <CheckCircle2 className="w-4 h-4 text-success" />;
    if (tipo === "predicho")
      return <AlertCircle className="w-4 h-4 text-primary" />;
    return <XCircle className="w-4 h-4 text-textSecondary" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-textMain">
          Tabla de Balances - Válvula {valveId}
        </h3>
        <p className="text-sm text-textSecondary">
          Detalle mensual de volúmenes y pérdidas
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-backgroundSecondary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                Período
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-textSecondary uppercase tracking-wider">
                Vol. Entrada (m³)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-textSecondary uppercase tracking-wider">
                Vol. Salida (m³)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-textSecondary uppercase tracking-wider">
                Pérdidas (m³)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-textSecondary uppercase tracking-wider">
                Índice (%)
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-textSecondary uppercase tracking-wider">
                Tipo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayData.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-backgroundSecondary transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-textMain">
                  {row.month}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-textMain">
                  {row.entrada.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-textMain">
                  {row.salida ? row.salida.toLocaleString() : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-warning">
                  {row.perdidas ? row.perdidas.toLocaleString() : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span
                    className={`text-sm font-bold ${getIndexColor(row.indice)}`}
                  >
                    {row.indice.toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    {getTipoIcon(row.tipo)}
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        row.tipo === "real"
                          ? "bg-success/10 text-success"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {row.tipo === "real" ? "Real" : "Predicho"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-backgroundSecondary">
            <tr>
              <td className="px-6 py-4 text-sm font-bold text-textMain">
                TOTALES
              </td>
              <td className="px-6 py-4 text-sm font-bold text-right text-textMain">
                {displayData
                  .reduce((sum, row) => sum + row.entrada, 0)
                  .toLocaleString()}{" "}
                m³
              </td>
              <td className="px-6 py-4 text-sm font-bold text-right text-textMain">
                {displayData
                  .reduce((sum, row) => sum + (row.salida || 0), 0)
                  .toLocaleString()}{" "}
                m³
              </td>
              <td className="px-6 py-4 text-sm font-bold text-right text-warning">
                {displayData
                  .reduce((sum, row) => sum + (row.perdidas || 0), 0)
                  .toLocaleString()}{" "}
                m³
              </td>
              <td className="px-6 py-4 text-sm font-bold text-right text-textMain">
                {(
                  displayData.reduce((sum, row) => sum + row.indice, 0) /
                  displayData.length
                ).toFixed(1)}
                %
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
