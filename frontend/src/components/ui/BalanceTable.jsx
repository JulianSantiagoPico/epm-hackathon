import { memo, useMemo } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

const BalanceTable = memo(function BalanceTable({
  valveId,
  data = [],
  kpis = null,
}) {
  // Transformar datos de la API al formato del componente (memoizado)
  const displayData = useMemo(() => {
    return data.map((item) => {
      // Formato de fecha: convertir periodo YYYYMM a texto legible
      const formatPeriodo = (periodo) => {
        if (!periodo) return "N/A";
        const year = periodo.substring(0, 4);
        const month = periodo.substring(4, 6);
        const meses = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ];
        return `${meses[parseInt(month) - 1]} ${year}`;
      };

      return {
        month: formatPeriodo(item.periodo),
        entrada: item.entrada || 0,
        salida: item.salida,
        perdidas: item.perdidas,
        indice: item.indice,
        tipo: item.es_pronostico ? "predicho" : "real",
      };
    });
  }, [data]);

  const getIndexColor = (indice) => {
    if (indice === null || indice === undefined) return "text-textSecondary";
    if (indice >= 10) return "text-error";
    if (indice >= 8) return "text-warning";
    return "text-success";
  };

  const getTipoIcon = (tipo) => {
    if (tipo === "real")
      return <CheckCircle2 className="w-4 h-4 text-success" />;
    if (tipo === "predicho")
      return <AlertCircle className="w-4 h-4 text-primary" />;
    return null;
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
                  {row.entrada
                    ? row.entrada.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-textMain">
                  {row.salida !== null && row.salida !== undefined
                    ? row.salida.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-warning">
                  {row.perdidas !== null && row.perdidas !== undefined
                    ? row.perdidas.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span
                    className={`text-sm font-bold ${getIndexColor(row.indice)}`}
                  >
                    {row.indice !== null && row.indice !== undefined
                      ? `${row.indice.toFixed(1)}%`
                      : "-"}
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
                  .reduce((sum, row) => sum + (row.entrada || 0), 0)
                  .toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                m³
              </td>
              <td className="px-6 py-4 text-sm font-bold text-right text-textMain">
                {displayData
                  .reduce((sum, row) => sum + (row.salida || 0), 0)
                  .toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                m³
              </td>
              <td className="px-6 py-4 text-sm font-bold text-right text-warning">
                {kpis
                  ? Math.abs(kpis.total_perdidas).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })
                  : displayData
                      .reduce((sum, row) => sum + (row.perdidas || 0), 0)
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}{" "}
                m³
              </td>
              <td className="px-6 py-4 text-sm font-bold text-right text-textMain">
                {kpis
                  ? kpis.indice_promedio.toFixed(1)
                  : displayData.filter((row) => row.indice !== null).length > 0
                  ? (
                      displayData
                        .filter((row) => row.indice !== null)
                        .reduce((sum, row) => sum + row.indice, 0) /
                      displayData.filter((row) => row.indice !== null).length
                    ).toFixed(1)
                  : "0.0"}
                %
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
});

export default BalanceTable;
