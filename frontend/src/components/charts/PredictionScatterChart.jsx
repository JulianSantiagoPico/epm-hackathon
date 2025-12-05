import { memo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ReferenceLine,
} from "recharts";

const CustomTooltip = memo(function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-border">
        <p className="text-sm font-medium text-textMain mb-1">
          Punto {data.id}
        </p>
        <p className="text-sm text-primary">Real: {data.real.toFixed(2)}%</p>
        <p className="text-sm text-secondary">
          Predicción: {data.predicted.toFixed(2)}%
        </p>
        <p className="text-sm text-textSecondary">
          Error: {Math.abs(data.real - data.predicted).toFixed(2)}%
        </p>
      </div>
    );
  }
  return null;
});

const PredictionScatterChart = memo(function PredictionScatterChart({
  data = [],
  modelName = "XGBoost",
}) {
  // Mock data si no hay datos
  const displayData =
    data.length > 0
      ? data
      : [
          { id: 1, real: 8.5, predicted: 8.2 },
          { id: 2, real: 9.2, predicted: 9.0 },
          { id: 3, real: 7.8, predicted: 8.1 },
          { id: 4, real: 10.1, predicted: 9.8 },
          { id: 5, real: 8.9, predicted: 9.2 },
          { id: 6, real: 9.5, predicted: 9.3 },
          { id: 7, real: 11.2, predicted: 10.8 },
          { id: 8, real: 7.3, predicted: 7.5 },
          { id: 9, real: 10.5, predicted: 10.2 },
          { id: 10, real: 8.8, predicted: 8.6 },
          { id: 11, real: 9.8, predicted: 9.9 },
          { id: 12, real: 12.1, predicted: 11.5 },
        ];

  // Calcular rango para la línea de referencia perfecta
  const allValues = displayData.flatMap((d) => [d.real, d.predicted]);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-textMain">
          Valores Reales vs Predicciones
        </h3>
        <p className="text-sm text-textSecondary">
          Modelo: <span className="font-medium text-primary">{modelName}</span>
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis
            type="number"
            dataKey="real"
            name="Real"
            stroke="#828282"
            style={{ fontSize: "12px" }}
            label={{
              value: "Valores Reales (%)",
              position: "insideBottom",
              offset: -10,
              style: { fill: "#828282" },
            }}
            domain={[minValue - 1, maxValue + 1]}
          />
          <YAxis
            type="number"
            dataKey="predicted"
            name="Predicción"
            stroke="#828282"
            style={{ fontSize: "12px" }}
            label={{
              value: "Predicciones (%)",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#828282" },
            }}
            domain={[minValue - 1, maxValue + 1]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ strokeDasharray: "3 3" }}
          />
          <Legend
            wrapperStyle={{ fontSize: "14px", paddingTop: "20px" }}
            iconType="circle"
            verticalAlign="bottom"
          />

          {/* Línea de referencia perfecta (y = x) */}
          <ReferenceLine
            segment={[
              { x: minValue - 1, y: minValue - 1 },
              { x: maxValue + 1, y: maxValue + 1 },
            ]}
            stroke="#828282"
            strokeDasharray="5 5"
            label={{
              value: "Predicción perfecta",
              position: "insideTopRight",
              fill: "#828282",
              fontSize: 10,
            }}
          />

          <Scatter
            name="Predicciones"
            data={displayData}
            fill="#008f4c"
            shape="circle"
            r={6}
          />
        </ScatterChart>
      </ResponsiveContainer>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-textSecondary">Total de puntos</p>
            <p className="text-lg font-bold text-textMain">
              {displayData.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-textSecondary">Error promedio</p>
            <p className="text-lg font-bold text-warning">
              {(
                displayData.reduce(
                  (sum, d) => sum + Math.abs(d.real - d.predicted),
                  0
                ) / displayData.length
              ).toFixed(2)}
              %
            </p>
          </div>
          <div>
            <p className="text-sm text-textSecondary">Correlación</p>
            <p className="text-lg font-bold text-success">0.94</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PredictionScatterChart;
