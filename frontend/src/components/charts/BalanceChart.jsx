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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-border">
        <p className="text-sm font-medium text-textMain mb-2">{label}</p>
        <p className="text-sm text-success">
          Entrada: {payload[0]?.value.toLocaleString()} m³
        </p>
        <p className="text-sm text-error">
          Salida: {payload[1]?.value.toLocaleString()} m³
        </p>
        {payload[2] && (
          <p className="text-sm text-warning">
            Pérdidas: {payload[2].value.toLocaleString()} m³
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function BalanceChart({ data = [] }) {
  // Mock data si no hay datos
  const displayData =
    data.length > 0
      ? data
      : [
          { month: "Ene", entrada: 12500, salida: 11450, perdidas: 1050 },
          { month: "Feb", entrada: 13200, salida: 11980, perdidas: 1220 },
          { month: "Mar", entrada: 11800, salida: 10950, perdidas: 850 },
          { month: "Abr", entrada: 14100, salida: 12670, perdidas: 1430 },
          { month: "May", entrada: 13500, salida: 12285, perdidas: 1215 },
          { month: "Jun", entrada: 12900, salida: 11738, perdidas: 1162 },
          { month: "Jul", entrada: 15200, salida: 13528, perdidas: 1672 },
          { month: "Ago", entrada: 14800, salida: null, perdidas: null },
        ];

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
}
