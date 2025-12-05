import { memo } from "react";
import { Network, Loader2 } from "lucide-react";

const CorrelationMatrix = memo(function CorrelationMatrix({
  data = null,
  loading = false,
  error = null,
}) {
  // Mock data como fallback
  const defaultVariables = [
    "Volumen Corregido",
    "Presión",
    "Temperatura",
    "Índice Pérdidas",
    "KPT",
    "Mes",
  ];

  const defaultCorrelationData = [
    [1.0, 0.65, -0.32, 0.78, 0.45, 0.12],
    [0.65, 1.0, -0.18, 0.52, 0.38, 0.08],
    [-0.32, -0.18, 1.0, -0.25, -0.15, -0.42],
    [0.78, 0.52, -0.25, 1.0, 0.42, 0.15],
    [0.45, 0.38, -0.15, 0.42, 1.0, 0.05],
    [0.12, 0.08, -0.42, 0.15, 0.05, 1.0],
  ];

  // Usar datos de la API si existen
  const variables = data?.variables || defaultVariables;
  const correlationData = data?.matrix || defaultCorrelationData;

  const getColor = (value) => {
    const absValue = Math.abs(value);
    if (absValue === 1) return "bg-primary text-white";
    if (absValue >= 0.7)
      return value > 0 ? "bg-success/80 text-white" : "bg-error/80 text-white";
    if (absValue >= 0.5)
      return value > 0 ? "bg-success/50 text-white" : "bg-error/50 text-white";
    if (absValue >= 0.3) return value > 0 ? "bg-success/30" : "bg-error/30";
    return "bg-backgroundSecondary";
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Network className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-textMain">
                Matriz de Correlación
              </h3>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Network className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-textMain">
                Matriz de Correlación
              </h3>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-error font-medium mb-2">
                Error al cargar matriz
              </p>
              <p className="text-sm text-textSecondary">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <Network className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-textMain">
              Matriz de Correlación
            </h3>
            <p className="text-sm text-textSecondary">
              Coeficiente de correlación de Pearson entre variables
            </p>
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex items-center gap-4 text-xs">
          <span className="text-textSecondary">Escala:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-error/80 rounded"></div>
            <span className="text-textSecondary">Negativa fuerte</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-backgroundSecondary rounded"></div>
            <span className="text-textSecondary">Débil</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-success/80 rounded"></div>
            <span className="text-textSecondary">Positiva fuerte</span>
          </div>
        </div>
      </div>

      <div className="p-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs font-medium text-textSecondary w-40"></th>
              {variables.map((variable, index) => (
                <th
                  key={index}
                  className="p-2 text-center text-xs font-medium text-textSecondary min-w-20"
                >
                  <div className="transform -rotate-45 origin-left whitespace-nowrap">
                    {variable}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variables.map((variable, rowIndex) => (
              <tr key={rowIndex} className="border-t border-border">
                <td className="p-2 text-sm font-medium text-textMain sticky left-0 bg-white">
                  {variable}
                </td>
                {correlationData[rowIndex].map((value, colIndex) => (
                  <td key={colIndex} className="p-1">
                    <div
                      className={`
                        w-full h-12 flex items-center justify-center rounded
                        text-sm font-bold transition-all hover:scale-105 cursor-pointer
                        ${getColor(value)}
                      `}
                      title={`${variables[rowIndex]} vs ${
                        variables[colIndex]
                      }: ${value.toFixed(2)}`}
                    >
                      {value.toFixed(2)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-border bg-backgroundSecondary">
        <p className="text-xs text-textSecondary">
          <strong>Interpretación:</strong> Los valores cercanos a 1 indican
          correlación positiva fuerte, valores cercanos a -1 indican correlación
          negativa fuerte, y valores cercanos a 0 indican correlación débil.
        </p>
      </div>
    </div>
  );
});

export default CorrelationMatrix;
