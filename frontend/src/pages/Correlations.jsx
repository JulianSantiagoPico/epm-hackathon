import { useState, useEffect, useMemo, useCallback } from "react";
import CorrelationMatrix from "../components/charts/CorrelationMatrix";
import InteractiveScatterPlot from "../components/charts/InteractiveScatterPlot";
import TopCorrelationsCard from "../components/ui/TopCorrelationsCard";
import api from "../services/api";

export default function Correlations() {
  // Mapeo de nombres de UI a nombres de API (memoizado)
  const variableMapping = useMemo(
    () => ({
      "Volumen Corregido (m³)": "VOLUMEN_ENTRADA_FINAL",
      "Presión (bar)": "PRESION_FINAL",
      "Temperatura (°C)": "TEMPERATURA_FINAL",
      "Índice de Pérdidas (%)": "INDICE_PERDIDAS_FINAL",
      "KPT (Factor)": "KPT_FINAL",
      "Número de Usuarios": "NUM_USUARIOS",
    }),
    []
  );

  const variables = useMemo(
    () => Object.keys(variableMapping),
    [variableMapping]
  );

  const [xVariable, setXVariable] = useState(variables[0]);
  const [yVariable, setYVariable] = useState(variables[3]);

  // Estados para datos de API
  const [topCorrelations, setTopCorrelations] = useState(null);
  const [correlationMatrix, setCorrelationMatrix] = useState(null);
  const [scatterData, setScatterData] = useState(null);
  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingMatrix, setLoadingMatrix] = useState(true);
  const [loadingScatter, setLoadingScatter] = useState(false);
  const [errorTop, setErrorTop] = useState(null);
  const [errorMatrix, setErrorMatrix] = useState(null);
  const [errorScatter, setErrorScatter] = useState(null);
  const [scatterCorrelation, setScatterCorrelation] = useState(null);

  // Cargar top correlaciones (memoizado)
  const fetchTopCorrelations = useCallback(async () => {
    try {
      setLoadingTop(true);
      setErrorTop(null);
      const data = await api.correlations.getTopCorrelations(3);
      setTopCorrelations(data);
    } catch (error) {
      console.error("Error al cargar top correlaciones:", error);
      setErrorTop(error.message || "Error al cargar las correlaciones");
    } finally {
      setLoadingTop(false);
    }
  }, []);

  useEffect(() => {
    fetchTopCorrelations();
  }, [fetchTopCorrelations]);

  // Cargar matriz de correlación (memoizado)
  const fetchCorrelationMatrix = useCallback(async () => {
    try {
      setLoadingMatrix(true);
      setErrorMatrix(null);
      const data = await api.correlations.getMatrix();
      setCorrelationMatrix(data);
    } catch (error) {
      console.error("Error al cargar matriz de correlación:", error);
      setErrorMatrix(error.message || "Error al cargar la matriz");
    } finally {
      setLoadingMatrix(false);
    }
  }, []);

  useEffect(() => {
    fetchCorrelationMatrix();
  }, [fetchCorrelationMatrix]);

  // Cargar datos de scatter plot cuando cambien las variables (memoizado)
  const fetchScatterData = useCallback(async () => {
    try {
      setLoadingScatter(true);
      setErrorScatter(null);

      const varX = variableMapping[xVariable];
      const varY = variableMapping[yVariable];

      const response = await api.correlations.getScatterData(varX, varY);

      // Transformar datos de la API al formato del componente
      const transformedData = response.data.map((point) => ({
        x: point.x,
        y: point.y,
        valvula: point.valvula,
        periodo: point.periodo,
        z: 5, // tamaño del punto
      }));

      setScatterData(transformedData);
      setScatterCorrelation(response.correlation);
    } catch (error) {
      console.error("Error al cargar scatter plot:", error);
      setErrorScatter(error.message || "Error al cargar los datos");
      setScatterData(null);
      setScatterCorrelation(null);
    } finally {
      setLoadingScatter(false);
    }
  }, [xVariable, yVariable, variableMapping]);

  useEffect(() => {
    fetchScatterData();
  }, [fetchScatterData]);

  // Handlers memoizados
  const handleXVariableChange = useCallback((e) => {
    setXVariable(e.target.value);
  }, []);

  const handleYVariableChange = useCallback((e) => {
    setYVariable(e.target.value);
  }, []);

  return (
    <div className="min-h-screen bg-backgroundSecondary">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-textMain mb-2">
            Análisis de Correlaciones
          </h1>
          <p className="text-textSecondary">
            Exploración de relaciones entre variables operativas del sistema de
            distribución
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Top Correlaciones */}
        <section>
          <TopCorrelationsCard
            correlations={topCorrelations}
            loading={loadingTop}
            error={errorTop}
          />
        </section>

        {/* Matriz de Correlación */}
        <section>
          <CorrelationMatrix
            data={correlationMatrix}
            loading={loadingMatrix}
            error={errorMatrix}
          />
        </section>

        {/* Selector de Variables para Scatter */}
        <section className="bg-white rounded-lg shadow-md p-6 border border-border">
          <h3 className="text-lg font-semibold text-textMain mb-4">
            Análisis Detallado de Correlación
          </h3>
          <p className="text-sm text-textSecondary mb-4">
            Selecciona dos variables para visualizar su relación
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-textSecondary mb-2 block">
                Variable X (Eje horizontal)
              </label>
              <select
                value={xVariable}
                onChange={handleXVariableChange}
                className="w-full px-4 py-2 bg-white border border-border rounded-lg text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {variables.map((variable) => (
                  <option key={variable} value={variable}>
                    {variable}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-textSecondary mb-2 block">
                Variable Y (Eje vertical)
              </label>
              <select
                value={yVariable}
                onChange={handleYVariableChange}
                className="w-full px-4 py-2 bg-white border border-border rounded-lg text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {variables.map((variable) => (
                  <option key={variable} value={variable}>
                    {variable}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Scatter Plot Interactivo */}
        <section>
          <InteractiveScatterPlot
            xVariable={xVariable}
            yVariable={yVariable}
            data={scatterData}
            loading={loadingScatter}
            error={errorScatter}
            correlation={scatterCorrelation}
          />
        </section>

        {/* Insights */}
        <section className="bg-white rounded-lg shadow-md p-6 border border-border">
          <h3 className="text-lg font-semibold text-textMain mb-4">
            💡 Insights Clave
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-success/5 rounded-lg border-l-4 border-success">
              <span className="text-2xl">📈</span>
              <div>
                <p className="text-sm font-medium text-textMain">
                  Relación Volumen-Pérdidas
                </p>
                <p className="text-xs text-textSecondary mt-1">
                  Existe una correlación positiva fuerte (0.78) entre el volumen
                  corregido y el índice de pérdidas, sugiriendo que mayores
                  volúmenes están asociados con mayores pérdidas en el sistema.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-error/5 rounded-lg border-l-4 border-error">
              <span className="text-2xl">📉</span>
              <div>
                <p className="text-sm font-medium text-textMain">
                  Impacto de Temperatura
                </p>
                <p className="text-xs text-textSecondary mt-1">
                  La temperatura muestra correlaciones negativas con el volumen
                  (-0.32) y el índice de pérdidas (-0.25), indicando que
                  temperaturas más altas podrían estar asociadas con menores
                  pérdidas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
              <span className="text-2xl">🔧</span>
              <div>
                <p className="text-sm font-medium text-textMain">
                  Variables Operativas Clave
                </p>
                <p className="text-xs text-textSecondary mt-1">
                  Presión y volumen muestran correlación positiva (0.65),
                  confirmando la relación esperada entre parámetros operativos
                  del sistema de distribución.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
