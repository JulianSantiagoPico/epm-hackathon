import {
  LineChart,
  Line,
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
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value ? `${entry.value.toFixed(2)}%` : "N/A"}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function LossIndexChart({ data = [] }) {
  // Transformar datos del backend al formato del gráfico
  const chartData = data.length > 0
    ? data.map(item => ({
        month: formatPeriodo(item.periodo),
        real: item.indice_real ? Math.abs(item.indice_real) : null,
        predicted: item.indice_predicho ? Math.abs(item.indice_predicho) : null,
      }))
    : [
        { month: "Ene", real: 8.5, predicted: 8.2 },
        { month: "Feb", real: 9.2, predicted: 9.0 },
        { month: "Mar", real: 7.8, predicted: 8.1 },
        { month: "Abr", real: 10.1, predicted: 9.8 },
        { month: "May", real: 8.9, predicted: 9.2 },
        { month: "Jun", real: 9.5, predicted: 9.3 },
        { month: "Jul", real: 11.2, predicted: 10.8 },
        { month: "Ago", real: null, predicted: 10.5 },
      ];
  
  // Helper para formatear período (YYYYMM -> Mes Corto)
  function formatPeriodo(periodo) {
    if (!periodo) return "";
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const mes = parseInt(periodo.toString().slice(-2)) - 1;
    return meses[mes] || periodo;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-textMain">
          Evolución del Índice de Pérdidas
        </h3>
        <p className="text-sm text-textSecondary">
          Comparación valores reales vs predicciones
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis
            dataKey="month"
            stroke="#828282"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#828282" style={{ fontSize: "12px" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "14px" }} iconType="line" />
          <Line
            type="monotone"
            dataKey="real"
            stroke="#008f4c"
            strokeWidth={2}
            name="Real"
            dot={{ fill: "#008f4c", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#2e7d5f"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Predicción"
            dot={{ fill: "#2e7d5f", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
