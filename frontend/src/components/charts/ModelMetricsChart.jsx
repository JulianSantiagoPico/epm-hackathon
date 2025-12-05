import { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomTooltip = memo(function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-border">
        <p className="text-sm font-medium text-textMain mb-2">
          {payload[0].payload.name}
        </p>
        <p className="text-sm text-primary">
          {payload[0].name}: {payload[0].value.toFixed(3)}
        </p>
      </div>
    );
  }
  return null;
});

const ModelMetricsChart = memo(function ModelMetricsChart({
  models = [],
  metric = "mae",
}) {
  // Mock data si no hay modelos
  const displayModels =
    models.length > 0
      ? models
      : [
          { name: "XGBoost", mae: 0.042, rmse: 0.068, r2: 0.94 },
          { name: "Prophet", mae: 0.058, rmse: 0.089, r2: 0.88 },
        ];

  const metricConfig = {
    mae: {
      label: "MAE (Error Absoluto Medio)",
      color: "#008f4c",
      description: "Valores menores son mejores",
    },
    rmse: {
      label: "RMSE (Error Cuadrático Medio)",
      color: "#2e7d5f",
      description: "Valores menores son mejores",
    },
    mape: {
      label: "MAPE (Error Porcentual Absoluto Medio)",
      color: "#4a90e2",
      description: "Valores menores son mejores (%)",
    },
    mase: {
      label: "MASE (Error Absoluto Escalado Medio)",
      color: "#f39c12",
      description:
        "Valores menores que 1 indican mejor predicción que el modelo naive",
    },
    r2: {
      label: "R² Score (Coeficiente de Determinación)",
      color: "#6fcf97",
      description: "Valores cercanos a 1 son mejores",
    },
  };

  const config = metricConfig[metric] || metricConfig.mae;

  // Determinar el mejor modelo para cada métrica
  const getBestModel = () => {
    if (metric === "r2") {
      return displayModels.reduce((prev, current) =>
        prev[metric] > current[metric] ? prev : current
      );
    }
    // Para MAE y RMSE, menor es mejor
    return displayModels.reduce((prev, current) =>
      prev[metric] < current[metric] ? prev : current
    );
  };

  const bestModel = getBestModel();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-textMain">{config.label}</h3>
        <p className="text-sm text-textSecondary">{config.description}</p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={displayModels}
          margin={{ top: 40, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis dataKey="name" stroke="#828282" style={{ fontSize: "14px" }} />
          <YAxis
            stroke="#828282"
            style={{ fontSize: "14px" }}
            domain={metric === "r2" ? [0, 1] : [0, "auto"]}
            tickFormatter={(value) => value.toFixed(3)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey={metric}
            name={metric.toUpperCase()}
            radius={[8, 8, 0, 0]}
            maxBarSize={100}
            minPointSize={5}
            label={{
              position: "top",
              fill: "#333333",
              fontSize: 14,
              formatter: (value) => (value ? value.toFixed(3) : "0"),
            }}
          >
            {displayModels.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  bestModel && entry.name === bestModel.name
                    ? config.color
                    : "#BDBDBD"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-textSecondary">Mejor modelo:</span>
          <span className="text-sm font-bold text-primary">
            {bestModel ? bestModel.name : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
});

export default ModelMetricsChart;
