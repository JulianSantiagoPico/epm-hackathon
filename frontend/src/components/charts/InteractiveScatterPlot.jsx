import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-border">
        <p className="text-sm font-medium text-textMain mb-1">
          Válvula {data.id}
        </p>
        <p className="text-sm text-primary">
          {payload[0].name}: {data.x.toFixed(2)}
        </p>
        <p className="text-sm text-secondary">
          {payload[1]?.name || "Y"}: {data.y.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

// Mock data estático fuera del componente
const defaultMockData = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  x: 50 + i * 3.2 + (i % 3) * 5,
  y: 5 + i * 0.4 + (i % 5) * 1.5,
  z: 5 + (i % 8),
}));

export default function InteractiveScatterPlot({
  xVariable,
  yVariable,
  data = null,
}) {
  const displayData = data || defaultMockData;

  // Calcular correlación simple
  const calculateCorrelation = (data) => {
    const n = data.length;
    const sumX = data.reduce((sum, d) => sum + d.x, 0);
    const sumY = data.reduce((sum, d) => sum + d.y, 0);
    const sumXY = data.reduce((sum, d) => sum + d.x * d.y, 0);
    const sumX2 = data.reduce((sum, d) => sum + d.x * d.x, 0);
    const sumY2 = data.reduce((sum, d) => sum + d.y * d.y, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  };

  const correlation = calculateCorrelation(displayData);

  const getCorrelationLabel = (corr) => {
    const abs = Math.abs(corr);
    if (abs >= 0.7) return "Fuerte";
    if (abs >= 0.4) return "Moderada";
    return "Débil";
  };

  const getCorrelationColor = (corr) => {
    const abs = Math.abs(corr);
    if (abs >= 0.7) return corr > 0 ? "text-success" : "text-error";
    if (abs >= 0.4) return "text-warning";
    return "text-textSecondary";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-textMain">
              Análisis de Correlación
            </h3>
            <p className="text-sm text-textSecondary">
              {xVariable} vs {yVariable}
            </p>
          </div>
        </div>

        {/* Métrica de correlación */}
        <div className="text-right">
          <p className="text-xs text-textSecondary mb-1">
            Coeficiente de Pearson
          </p>
          <p
            className={`text-3xl font-bold ${getCorrelationColor(correlation)}`}
          >
            {correlation.toFixed(3)}
          </p>
          <p
            className={`text-xs font-medium ${getCorrelationColor(
              correlation
            )}`}
          >
            {getCorrelationLabel(correlation)}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis
            type="number"
            dataKey="x"
            name={xVariable}
            stroke="#828282"
            style={{ fontSize: "12px" }}
            label={{
              value: xVariable,
              position: "bottom",
              offset: 30,
              style: { fill: "#828282" },
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yVariable}
            stroke="#828282"
            style={{ fontSize: "12px" }}
            label={{
              value: yVariable,
              angle: -90,
              position: "insideLeft",
              style: { fill: "#828282" },
            }}
          />
          <ZAxis type="number" dataKey="z" range={[50, 200]} />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ strokeDasharray: "3 3" }}
          />
          <Scatter
            name="Puntos"
            data={displayData}
            fill="#008f4c"
            shape="circle"
          />
        </ScatterChart>
      </ResponsiveContainer>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-textSecondary">Datos analizados</p>
            <p className="text-lg font-bold text-textMain">
              {displayData.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-textSecondary">Tipo de relación</p>
            <p
              className={`text-lg font-bold ${
                correlation > 0 ? "text-success" : "text-error"
              }`}
            >
              {correlation > 0 ? "Positiva" : "Negativa"}
            </p>
          </div>
          <div>
            <p className="text-sm text-textSecondary">Fuerza</p>
            <p
              className={`text-lg font-bold ${getCorrelationColor(
                correlation
              )}`}
            >
              {getCorrelationLabel(correlation)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
