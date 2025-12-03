import { useState } from "react";
import ModelComparisonCard from "../components/ui/ModelComparisonCard";
import ModelMetricsChart from "../components/charts/ModelMetricsChart";
import PredictionScatterChart from "../components/charts/PredictionScatterChart";
import ModelDetailsCard from "../components/ui/ModelDetailsCard";

export default function Models() {
  const [selectedModel, setSelectedModel] = useState("xgboost");
  const [selectedMetric, setSelectedMetric] = useState("mae");

  const models = [
    {
      id: "xgboost",
      name: "XGBoost",
      mae: 0.042,
      rmse: 0.068,
      r2: 0.94,
      trainTime: "3.2 min",
      isBest: true,
    },
    {
      id: "prophet",
      name: "Prophet",
      mae: 0.058,
      rmse: 0.089,
      r2: 0.88,
      trainTime: "5.1 min",
      isBest: false,
    },
  ];

  const scatterData = {
    xgboost: [
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
    ],
    prophet: [
      { id: 1, real: 8.5, predicted: 7.9 },
      { id: 2, real: 9.2, predicted: 9.5 },
      { id: 3, real: 7.8, predicted: 8.4 },
      { id: 4, real: 10.1, predicted: 9.2 },
      { id: 5, real: 8.9, predicted: 8.5 },
      { id: 6, real: 9.5, predicted: 9.8 },
      { id: 7, real: 11.2, predicted: 10.1 },
      { id: 8, real: 7.3, predicted: 7.9 },
      { id: 9, real: 10.5, predicted: 9.8 },
      { id: 10, real: 8.8, predicted: 9.1 },
      { id: 11, real: 9.8, predicted: 9.2 },
      { id: 12, real: 12.1, predicted: 10.9 },
    ],
  };

  return (
    <div className="min-h-screen bg-backgroundSecondary">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-textMain mb-2">
            Modelos Predictivos
          </h1>
          <p className="text-textSecondary">
            Comparación, evaluación y análisis de modelos de Machine Learning
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Comparación de Modelos */}
        <section>
          <ModelComparisonCard
            models={models}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        </section>

        {/* Selector de Métrica */}
        <section className="bg-white rounded-lg shadow-md p-4 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selector de Métrica */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-textSecondary">
                Visualizar métrica:
              </span>
              <div className="flex gap-2">
                {["mae", "rmse", "r2"].map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${
                        selectedMetric === metric
                          ? "bg-primary text-white shadow-md"
                          : "bg-backgroundSecondary text-textSecondary hover:bg-border"
                      }
                    `}
                  >
                    {metric.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Modelo */}
            <div className="flex items-center gap-4 md:justify-end border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
              <span className="text-sm font-medium text-textSecondary">
                Modelo activo:
              </span>
              <div className="flex gap-2">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${
                        selectedModel === model.id
                          ? "bg-primary text-white shadow-md"
                          : "bg-backgroundSecondary text-textSecondary hover:bg-border"
                      }
                    `}
                  >
                    {model.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Gráficos de Comparación */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModelMetricsChart models={models} metric={selectedMetric} />
          <PredictionScatterChart
            modelName={
              models.find((m) => m.id === selectedModel)?.name || "XGBoost"
            }
            data={scatterData[selectedModel]}
          />
        </section>

        {/* Detalles Técnicos */}
        <section>
          <div className="mb-4">
            <label className="text-sm font-medium text-textSecondary mb-2 block">
              Seleccionar modelo para ver detalles:
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-4 py-2 bg-white border border-border rounded-lg text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          <ModelDetailsCard modelId={selectedModel} />
        </section>
      </div>
    </div>
  );
}
