import { Settings, TrendingUp, Package } from "lucide-react";

export default function ModelDetailsCard({
  modelId = "xgboost",
  details = null,
}) {
  // Mock data según el modelo
  const modelDetails = details || {
    xgboost: {
      version: "XGBoost 2.0.3",
      framework: "Scikit-Learn 1.3.2",
      trainedOn: "2025-12-01",
      dataPoints: 15240,
      hyperparameters: {
        n_estimators: 100,
        max_depth: 6,
        learning_rate: 0.1,
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
    prophet: {
      version: "Prophet 1.1.5",
      framework: "Facebook Prophet",
      trainedOn: "2025-12-01",
      dataPoints: 15240,
      hyperparameters: {
        changepoint_prior_scale: 0.05,
        seasonality_prior_scale: 10,
        holidays_prior_scale: 10,
        seasonality_mode: "multiplicative",
        yearly_seasonality: true,
      },
      features: [
        { name: "tendencia", importance: 0.42 },
        { name: "estacionalidad_anual", importance: 0.28 },
        { name: "estacionalidad_mensual", importance: 0.18 },
        { name: "efectos_festivos", importance: 0.12 },
      ],
    },
  };

  const currentModel = modelDetails[modelId] || modelDetails.xgboost;

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
}
