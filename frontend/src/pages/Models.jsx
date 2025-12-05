import { useState, useEffect, useMemo, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import ModelComparisonCard from "../components/ui/ModelComparisonCard";
import ModelMetricsChart from "../components/charts/ModelMetricsChart";
import PredictionScatterChart from "../components/charts/PredictionScatterChart";
import ModelDetailsCard from "../components/ui/ModelDetailsCard";
import { modelsAPI } from "../services/api";

export default function Models() {
  const [selectedValve, setSelectedValve] = useState("VALVULA_1");
  const [selectedMetric, setSelectedMetric] = useState("mae");
  const [selectedModelForDetails, setSelectedModelForDetails] = useState(null);
  const [bestModelsByValve, setBestModelsByValve] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [scatterData, setScatterData] = useState({});
  const [modelDetails, setModelDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingScatter, setLoadingScatter] = useState(false);
  const [error, setError] = useState(null);

  // Mapeo de nombres de modelos del backend al frontend - memoizado
  const modelNameMapping = useMemo(
    () => ({
      LightGBM: { id: "lightgbm", name: "LightGBM" },
      CatBoost: { id: "catboost", name: "CatBoost" },
      RandomForest: { id: "randomforest", name: "RandomForest" },
    }),
    []
  );

  const fetchModelsData = useCallback(async () => {
    try {
      setLoading(true);

      // Cargar mejor modelo por válvula
      const bestByValveResponse = await modelsAPI.getBestByValve("mae");

      // Transformar datos para mostrar mejor modelo por válvula
      const bestModels = bestByValveResponse.valves.map((valve) => {
        const mapping = modelNameMapping[valve.mejor_modelo];
        return {
          valvula: valve.valvula,
          modelo: valve.mejor_modelo,
          modeloId: mapping?.id || valve.mejor_modelo.toLowerCase(),
          mae: valve.mae,
          rmse: valve.rmse,
          mape: valve.mape,
          mase: valve.mase,
          r2: valve.r2,
        };
      });

      setBestModelsByValve(bestModels);

      // Seleccionar primera válvula por defecto
      if (bestModels.length > 0) {
        setSelectedValve(bestModels[0].valvula);
      }
    } catch (err) {
      console.error("Error al cargar datos de modelos:", err);
      setError(err.message);

      // Datos de respaldo en caso de error
      setBestModelsByValve([
        {
          valvula: "VALVULA_1",
          modelo: "CatBoost",
          modeloId: "catboost",
          mae: 71.41,
          rmse: 94.8,
          mape: 15.29,
          mase: 0.98,
          r2: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [modelNameMapping]);

  useEffect(() => {
    fetchModelsData();
  }, [fetchModelsData]);

  // Cargar métricas de todos los modelos cuando cambia la válvula seleccionada
  const fetchModelsByValve = useCallback(async () => {
    if (!selectedValve) return;

    try {
      // Cargar métricas de todos los modelos para la válvula seleccionada
      const allMetricsResponse = await modelsAPI.getMetrics(selectedValve);

      // Transformar datos del backend al formato que espera ModelMetricsChart
      const transformedModels = allMetricsResponse.models.map((model) => ({
        id: model.id,
        name: model.name,
        mae: model.metrics.mae,
        rmse: model.metrics.rmse,
        mape: model.metrics.mape || 0,
        mase: model.metrics.mase || 0,
        r2: model.metrics.r2 || 0,
      }));

      setAllModels(transformedModels);
    } catch (err) {
      console.error("Error al cargar métricas por válvula:", err);
    }
  }, [selectedValve]);

  useEffect(() => {
    fetchModelsByValve();
  }, [fetchModelsByValve]);

  // Cargar datos de scatter cuando cambia la válvula seleccionada
  const fetchScatterData = useCallback(async () => {
    if (!selectedValve || bestModelsByValve.length === 0) return;

    // No recargar si ya tenemos los datos
    if (scatterData[selectedValve]) return;

    try {
      setLoadingScatter(true);

      // Encontrar el mejor modelo para la válvula seleccionada
      const valveData = bestModelsByValve.find(
        (v) => v.valvula === selectedValve
      );
      if (!valveData) return;

      // Cargar datos de scatter plot del backend
      const response = await modelsAPI.getPredictionsScatter(
        valveData.modelo,
        selectedValve
      );

      // Validar que la respuesta tenga datos
      if (response && response.data) {
        setScatterData((prev) => ({
          ...prev,
          [selectedValve]: response.data,
        }));
      } else {
        // Si no hay datos del backend, limpiar
        setScatterData((prev) => ({
          ...prev,
          [selectedValve]: [],
        }));
      }
    } catch (err) {
      console.error(`Error al cargar scatter data para ${selectedValve}:`, err);
      // En caso de error, usar array vacío (el componente tiene fallback)
      setScatterData((prev) => ({
        ...prev,
        [selectedValve]: [],
      }));
    } finally {
      setLoadingScatter(false);
    }
  }, [selectedValve, bestModelsByValve, scatterData]);

  useEffect(() => {
    fetchScatterData();
  }, [fetchScatterData]);

  // Cargar detalles del modelo cuando cambia la selección
  const fetchModelDetails = useCallback(async () => {
    if (!selectedValve || allModels.length === 0) return;

    // Determinar qué modelo cargar
    const modelToLoad = selectedModelForDetails || allModels[0]?.id;
    if (!modelToLoad) return;

    const cacheKey = `${selectedValve}_${modelToLoad}`;

    // No recargar si ya tenemos los datos en cache
    if (modelDetails[cacheKey]) return;

    try {
      const response = await modelsAPI.getModelDetails(
        modelToLoad,
        selectedValve
      );

      // Validar que la respuesta sea válida
      if (response && response.id) {
        setModelDetails((prev) => ({
          ...prev,
          [cacheKey]: response,
        }));
      }
    } catch (err) {
      console.error(
        `Error al cargar detalles del modelo ${modelToLoad} para ${selectedValve}:`,
        err
      );
      // El componente ModelDetailsCard tiene datos de respaldo
    }
  }, [selectedValve, selectedModelForDetails, allModels, modelDetails]);

  useEffect(() => {
    fetchModelDetails();
  }, [fetchModelDetails]);

  // Actualizar modelo seleccionado cuando cambia la válvula
  useEffect(() => {
    if (allModels.length > 0 && !selectedModelForDetails) {
      setSelectedModelForDetails(allModels[0]?.id);
    }
  }, [allModels, selectedModelForDetails]);

  // Memorizar datos de la válvula seleccionada
  const selectedValveData = useMemo(() => {
    return bestModelsByValve.find((v) => v.valvula === selectedValve);
  }, [bestModelsByValve, selectedValve]);

  // Memorizar lista de métricas
  const metrics = useMemo(() => ["mae", "rmse", "mape", "mase"], []);

  // Memorizar datos de scatter de la válvula actual
  const currentScatterData = useMemo(() => {
    return scatterData[selectedValve] || [];
  }, [scatterData, selectedValve]);

  // Memorizar detalles del modelo actual
  const currentModelDetails = useMemo(() => {
    const cacheKey = `${selectedValve}_${selectedModelForDetails}`;
    return modelDetails[cacheKey];
  }, [modelDetails, selectedValve, selectedModelForDetails]);

  // Callbacks memoizados para handlers
  const handleValveChange = useCallback((valve) => {
    setSelectedValve(valve);
  }, []);

  const handleMetricChange = useCallback((metric) => {
    setSelectedMetric(metric);
  }, []);

  const handleModelDetailsChange = useCallback((e) => {
    setSelectedModelForDetails(e.target.value);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-backgroundSecondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-textSecondary">Cargando modelos...</p>
        </div>
      </div>
    );
  }

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
        {/* Selector de Válvula */}
        <section className="bg-white rounded-lg shadow-md p-4 border border-border">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-textSecondary">
              Seleccionar válvula:
            </span>
            <div className="flex gap-2 flex-wrap">
              {bestModelsByValve.map((valve) => (
                <button
                  key={valve.valvula}
                  onClick={() => handleValveChange(valve.valvula)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      selectedValve === valve.valvula
                        ? "bg-primary text-white shadow-md"
                        : "bg-backgroundSecondary text-textSecondary hover:bg-border"
                    }
                  `}
                >
                  {valve.valvula}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Información del Mejor Modelo para la Válvula Seleccionada */}
        {selectedValveData && (
          <section className="bg-white rounded-lg shadow-md p-6 border border-border">
            <h2 className="text-xl font-bold text-textMain mb-4">
              Mejor Modelo: {selectedValveData.modelo}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {selectedValveData.mae.toFixed(2)}
                </p>
                <p className="text-sm text-textSecondary">MAE</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {selectedValveData.rmse.toFixed(2)}
                </p>
                <p className="text-sm text-textSecondary">RMSE</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {selectedValveData.mape
                    ? selectedValveData.mape.toFixed(2)
                    : "N/A"}
                </p>
                <p className="text-sm text-textSecondary">MAPE</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {selectedValveData.mase
                    ? selectedValveData.mase.toFixed(2)
                    : "N/A"}
                </p>
                <p className="text-sm text-textSecondary">MASE</p>
              </div>
            </div>
          </section>
        )}

        {/* Comparación de Modelos por Métrica */}
        <section className="bg-white rounded-lg shadow-md p-6 border border-border">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-textMain">
                Comparación de Modelos
              </h2>
              <p className="text-sm text-textSecondary mt-1">
                Rendimiento de todos los modelos según la métrica seleccionada
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-textSecondary">
                Métrica:
              </span>
              <div className="flex gap-2">
                {metrics.map((metric) => (
                  <button
                    key={metric}
                    onClick={() => handleMetricChange(metric)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-all
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
          </div>

          {allModels.length > 0 ? (
            <ModelMetricsChart models={allModels} metric={selectedMetric} />
          ) : (
            <div className="text-center py-8 text-textSecondary">
              No hay datos de modelos para comparar
            </div>
          )}
        </section>

        {/* Gráfico de Predicciones - Solo para válvula seleccionada */}
        <section>
          {loadingScatter ? (
            <div className="bg-white rounded-lg shadow-md p-6 border border-border flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-sm text-textSecondary">
                  Cargando datos de predicción...
                </p>
              </div>
            </div>
          ) : (
            <PredictionScatterChart
              modelName={selectedValveData?.modelo || "Modelo"}
              data={currentScatterData}
            />
          )}
        </section>

        {/* Detalles Técnicos del Modelo */}
        <section className="bg-white rounded-lg shadow-md p-6 border border-border">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-textMain">
              Detalles Técnicos del Modelo
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-textSecondary">
                Seleccionar modelo:
              </span>
              <select
                value={selectedModelForDetails || ""}
                onChange={handleModelDetailsChange}
                className="px-4 py-2 bg-backgroundSecondary border border-border rounded-lg text-textMain text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary hover:bg-border transition-colors"
              >
                {allModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ModelDetailsCard
            modelId={selectedModelForDetails}
            details={currentModelDetails}
          />
        </section>
      </div>
    </div>
  );
}
