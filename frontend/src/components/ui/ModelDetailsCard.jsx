import { memo } from "react";
import { Settings, TrendingUp, Package } from "lucide-react";

const ModelDetailsCard = memo(function ModelDetailsCard({
  modelId = "lightgbm",
  details = null,
}) {
  // Mock data como fallback
  const mockData = {
    lightgbm: {
      version: "LightGBM 4.1.0",
      framework: "Scikit-Learn 1.3.2",
      trainedOn: "2025-12-01",
      dataPoints: 15240,
      hyperparameters: {
        n_estimators: 100,
        max_depth: 6,
        learning_rate: 0.1,
        num_leaves: 31,
        subsample: 0.8,
        colsample_bytree: 0.8,
      },
      features: [
        { name: "volumen_corregido", importance: 0.35 },
        { name: "presion", importance: 0.22 },
        { name: "temperatura", importance: 0.18 },
        { name: "mes", importance: 0.12 },
        { name: "estrato", importance: 0.08 },
        { name: "tipo_usuario", importance: 0.05 },
      ],
    },
    catboost: {
      version: "CatBoost 1.2.2",
      framework: "CatBoost Native",
      trainedOn: "2025-12-01",
      dataPoints: 15240,
      hyperparameters: {
        iterations: 100,
        depth: 6,
        learning_rate: 0.1,
        l2_leaf_reg: 3,
        border_count: 128,
      },
      features: [
        { name: "volumen_corregido", importance: 0.38 },
        { name: "presion", importance: 0.24 },
        { name: "temperatura", importance: 0.16 },
        { name: "mes", importance: 0.11 },
        { name: "num_usuarios", importance: 0.07 },
        { name: "estrato", importance: 0.04 },
      ],
    },
    randomforest: {
      version: "RandomForest",
      framework: "Scikit-Learn 1.3.2",
      trainedOn: "2025-12-01",
      dataPoints: 15240,
      hyperparameters: {
        n_estimators: 100,
        max_depth: 10,
        min_samples_split: 5,
        min_samples_leaf: 2,
        max_features: "sqrt",
      },
      features: [
        { name: "volumen_corregido", importance: 0.32 },
        { name: "presion", importance: 0.2 },
        { name: "temperatura", importance: 0.19 },
        { name: "mes", importance: 0.14 },
        { name: "estrato", importance: 0.09 },
        { name: "tipo_usuario", importance: 0.06 },
      ],
    },
  };

  // Usar datos del backend si están disponibles, sino usar mock
  const currentModel = details
    ? {
        version: details.version,
        framework: details.framework,
        trainedOn: details.trained_on,
        dataPoints: details.data_points,
        hyperparameters: details.hyperparameters,
        features: details.features,
      }
    : mockData[modelId] || mockData.lightgbm;

  return (
    <div className="bg-white rounded-lg shadow-md border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-textMain">
              Detalles Técnicos
            </h3>
            <p className="text-sm text-textSecondary">
              Configuración y características del modelo
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Información General */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-5 h-5 text-secondary" />
            <h4 className="font-semibold text-textMain">Información General</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-backgroundSecondary p-3 rounded-lg">
              <p className="text-xs text-textSecondary mb-1">Versión</p>
              <p className="text-sm font-medium text-textMain">
                {currentModel.version}
              </p>
            </div>
            <div className="bg-backgroundSecondary p-3 rounded-lg">
              <p className="text-xs text-textSecondary mb-1">Framework</p>
              <p className="text-sm font-medium text-textMain">
                {currentModel.framework}
              </p>
            </div>
            <div className="bg-backgroundSecondary p-3 rounded-lg">
              <p className="text-xs text-textSecondary mb-1">
                Fecha de entrenamiento
              </p>
              <p className="text-sm font-medium text-textMain">
                {currentModel.trainedOn}
              </p>
            </div>
            <div className="bg-backgroundSecondary p-3 rounded-lg">
              <p className="text-xs text-textSecondary mb-1">
                Datos de entrenamiento
              </p>
              <p className="text-sm font-medium text-textMain">
                {currentModel.dataPoints.toLocaleString()} registros
              </p>
            </div>
          </div>
        </section>

        {/* Hiperparámetros */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-5 h-5 text-secondary" />
            <h4 className="font-semibold text-textMain">Hiperparámetros</h4>
          </div>
          <div className="bg-backgroundSecondary rounded-lg p-4">
            <div className="space-y-2">
              {Object.entries(currentModel.hyperparameters).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-sm text-textSecondary font-mono">
                      {key}
                    </span>
                    <span className="text-sm font-medium text-textMain">
                      {value.toString()}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Features Importantes */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <h4 className="font-semibold text-textMain">
              Features Importantes
            </h4>
          </div>
          <div className="space-y-2">
            {currentModel.features.map((feature, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-textMain font-medium">
                    {feature.name}
                  </span>
                  <span className="text-textSecondary">
                    {(feature.importance * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-backgroundSecondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${feature.importance * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
});

export default ModelDetailsCard;
