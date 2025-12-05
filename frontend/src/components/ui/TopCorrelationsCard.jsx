import { memo, useMemo } from "react";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";

const TopCorrelationsCard = memo(function TopCorrelationsCard({
  correlations = null,
  loading = false,
  error = null,
}) {
  // Mock data como fallback
  const defaultCorrelations = {
    positive: [
      { var1: "Volumen Corregido", var2: "Índice de Pérdidas", value: 0.78 },
      { var1: "Volumen Corregido", var2: "Presión", value: 0.65 },
      { var1: "Índice de Pérdidas", var2: "Presión", value: 0.52 },
    ],
    negative: [
      { var1: "Temperatura", var2: "Mes", value: -0.42 },
      { var1: "Volumen Corregido", var2: "Temperatura", value: -0.32 },
      { var1: "Índice de Pérdidas", var2: "Temperatura", value: -0.25 },
    ],
  };

  // Transformar datos de la API si existen (memoizado)
  const data = useMemo(
    () =>
      correlations
        ? {
            positive:
              correlations.top_positive?.map((item) => ({
                var1: item.var1,
                var2: item.var2,
                value: item.corr,
              })) || [],
            negative:
              correlations.top_negative?.map((item) => ({
                var1: item.var1,
                var2: item.var2,
                value: item.corr,
              })) || [],
          }
        : defaultCorrelations,
    [correlations]
  );

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md p-6 border border-border"
          >
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-border">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-error font-medium mb-2">
              Error al cargar correlaciones
            </p>
            <p className="text-sm text-textSecondary">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Correlaciones Positivas */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-success/10">
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-textMain">
              Correlaciones Positivas
            </h3>
            <p className="text-sm text-textSecondary">
              Variables que aumentan juntas
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {data.positive.map((item, index) => (
            <div key={index} className="bg-backgroundSecondary rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-textMain">
                    {item.var1}
                  </p>
                  <p className="text-xs text-textSecondary mt-1">
                    ↔ {item.var2}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-success">
                    {item.value.toFixed(2)}
                  </p>
                  <p className="text-xs text-textSecondary">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </p>
                </div>
              </div>
              <div className="w-full bg-white rounded-full h-2 mt-2">
                <div
                  className="bg-success h-2 rounded-full transition-all"
                  style={{ width: `${item.value * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Correlaciones Negativas */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-error/10">
            <TrendingDown className="w-5 h-5 text-error" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-textMain">
              Correlaciones Negativas
            </h3>
            <p className="text-sm text-textSecondary">
              Variables con relación inversa
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {data.negative.map((item, index) => (
            <div key={index} className="bg-backgroundSecondary rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-textMain">
                    {item.var1}
                  </p>
                  <p className="text-xs text-textSecondary mt-1">
                    ↔ {item.var2}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-error">
                    {item.value.toFixed(2)}
                  </p>
                  <p className="text-xs text-textSecondary">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </p>
                </div>
              </div>
              <div className="w-full bg-white rounded-full h-2 mt-2">
                <div
                  className="bg-error h-2 rounded-full transition-all"
                  style={{ width: `${Math.abs(item.value) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default TopCorrelationsCard;
