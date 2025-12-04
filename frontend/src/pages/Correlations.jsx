import { useState } from "react";
import CorrelationMatrix from "../components/charts/CorrelationMatrix";
import InteractiveScatterPlot from "../components/charts/InteractiveScatterPlot";
import TopCorrelationsCard from "../components/ui/TopCorrelationsCard";

export default function Correlations() {
  const [xVariable, setXVariable] = useState("Volumen Corregido (m³)");
  const [yVariable, setYVariable] = useState("Índice de Pérdidas (%)");

  const variables = [
    "Volumen Corregido (m³)",
    "Presión (bar)",
    "Temperatura (°C)",
    "Índice de Pérdidas (%)",
    "KPT (Factor)",
    "Mes",
  ];

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
          <TopCorrelationsCard />
        </section>

        {/* Matriz de Correlación */}
        <section>
          <CorrelationMatrix />
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
                onChange={(e) => setXVariable(e.target.value)}
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
                onChange={(e) => setYVariable(e.target.value)}
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
          <InteractiveScatterPlot xVariable={xVariable} yVariable={yVariable} />
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
