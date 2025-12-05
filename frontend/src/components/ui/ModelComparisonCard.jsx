import { Brain, CheckCircle2, Trophy } from "lucide-react";

export default function ModelComparisonCard({
  models = [],
  selectedModel,
  onSelectModel,
}) {
  // Mock data si no se pasan modelos
  const displayModels =
    models.length > 0
      ? models
      : [
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

  const getMetricColor = (value, metric) => {
    if (metric === "r2") {
      return value >= 0.9
        ? "text-success"
        : value >= 0.8
        ? "text-warning"
        : "text-error";
    }
    // Para MAE y RMSE, valores menores son mejores
    return value <= 0.05
      ? "text-success"
      : value <= 0.08
      ? "text-warning"
      : "text-error";
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-textMain">
              Comparación de Modelos
            </h3>
            <p className="text-sm text-textSecondary">
              Métricas de performance y eficiencia
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayModels.map((model) => (
            <div
              key={model.id}
              onClick={() => onSelectModel && onSelectModel(model.id)}
              className={`
                relative p-6 rounded-lg border-2 transition-all cursor-pointer
                ${
                  selectedModel === model.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50"
                }
              `}
            >
              {/* Badge de mejor modelo */}
              {model.isBest && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium">
                    <Trophy className="w-3 h-3" />
                    Mejor
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-xl font-bold text-textMain mb-1">
                  {model.name}
                </h4>
                <p className="text-sm text-textSecondary">Modelo predictivo</p>
              </div>

              {/* Métricas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-textSecondary">
                    MAE (Error Abs. Medio)
                  </span>
                  <span
                    className={`text-lg font-bold ${getMetricColor(
                      model.mae,
                      "mae"
                    )}`}
                  >
                    {model.mae.toFixed(3)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-textSecondary">
                    RMSE (Error Cuadrático)
                  </span>
                  <span
                    className={`text-lg font-bold ${getMetricColor(
                      model.rmse,
                      "rmse"
                    )}`}
                  >
                    {model.rmse.toFixed(3)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-textSecondary">R² Score</span>
                  <span
                    className={`text-lg font-bold ${getMetricColor(
                      model.r2,
                      "r2"
                    )}`}
                  >
                    {model.r2.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-textSecondary">
                    Tiempo de entrenamiento
                  </span>
                  <span className="text-sm font-medium text-textMain">
                    {model.trainTime}
                  </span>
                </div>
              </div>

              {/* Indicador de selección */}
              {selectedModel === model.id && (
                <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Modelo activo
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
