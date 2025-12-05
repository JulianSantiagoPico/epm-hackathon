import { memo, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = memo(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-border">
        <p className="text-sm font-medium text-textMain mb-2">{label}</p>
        {payload[0] && payload[0].value !== null && (
          <p className="text-sm text-success">
            Entrada:{" "}
            {payload[0].value.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}{" "}
            m³
          </p>
        )}
        {payload[1] && payload[1].value !== null && (
          <p className="text-sm text-error">
            Salida:{" "}
            {payload[1].value.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}{" "}
            m³
          </p>
        )}
        {payload[2] && payload[2].value !== null && (
          <p className="text-sm text-warning">
            Pérdidas:{" "}
            {payload[2].value.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}{" "}
            m³
          </p>
        )}
      </div>
    );
  }
  return null;
});

const BalanceChart = memo(function BalanceChart({ data = [] }) {
  // Transformar datos de la API al formato del gráfico (memoizado)
  const displayData = useMemo(() => {
    return data.map((item) => {
      // Formato de periodo: YYYYMM a abreviatura del mes
      const formatPeriodo = (periodo) => {
        if (!periodo) return "N/A";
        const month = periodo.substring(4, 6);
        const meses = [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ];
        return meses[parseInt(month) - 1];
      };

      return {
        month: formatPeriodo(item.periodo),
        entrada: item.entrada || null,
        salida: item.salida !== undefined ? item.salida : null,
        perdidas: item.perdidas !== undefined ? item.perdidas : null,
      };
    });
  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-textMain">
          Comparación Volumen Entrada vs Salida
        </h3>
        <p className="text-sm text-textSecondary">
          Evolución mensual de balances de gas
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={displayData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis
            dataKey="month"
            stroke="#828282"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#828282"
            style={{ fontSize: "12px" }}
            label={{
              value: "Volumen (m³)",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#828282", fontSize: "12px" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "14px" }} iconType="rect" />
          <Bar
            dataKey="entrada"
            name="Volumen Entrada"
            fill="#6fcf97"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="salida"
            name="Volumen Salida"
            fill="#008f4c"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="perdidas"
            name="Pérdidas"
            fill="#f7b731"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-around text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-success rounded"></div>
            <span className="text-textSecondary">Entrada (Macromedición)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded"></div>
            <span className="text-textSecondary">Salida (Facturación)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-warning rounded"></div>
            <span className="text-textSecondary">Pérdidas</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default BalanceChart;
