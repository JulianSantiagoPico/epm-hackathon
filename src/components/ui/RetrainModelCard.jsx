import { useState } from "react";
import {
  RefreshCw,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Loader,
} from "lucide-react";

export default function RetrainModelCard({ lastTraining, currentMetrics }) {
  const [isRetraining, setIsRetraining] = useState(false);

  const handleRetrain = async () => {
    setIsRetraining(true);

    try {
      // Simular llamada al backend para reentrenar
      await new Promise((resolve) => setTimeout(resolve, 3000));

      alert("Reentrenamiento iniciado exitosamente");
    } finally {
      setIsRetraining(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-textMain">
              Reentrenamiento de Modelo
            </h3>
            <p className="text-sm text-textSecondary">
              Actualizar modelo predictivo
            </p>
          </div>
        </div>
      </div>

      {/* Métricas actuales */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-backgroundSecondary rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-textSecondary">MAE Actual</span>
          </div>
          <p className="text-2xl font-bold text-textMain">
            {currentMetrics?.mae || "0.00"}
          </p>
        </div>

        <div className="bg-backgroundSecondary rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-textSecondary">RMSE Actual</span>
          </div>
          <p className="text-2xl font-bold text-textMain">
            {currentMetrics?.rmse || "0.00"}
          </p>
        </div>
      </div>

      {/* Último entrenamiento */}
      <div className="flex items-center justify-between py-3 border-t border-border mb-6">
        <span className="text-sm text-textSecondary flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Último entrenamiento
        </span>
        <span className="text-sm font-medium text-textMain">
          {lastTraining || "Nunca"}
        </span>
      </div>

      {/* Botón de reentrenamiento */}
      <button
        onClick={handleRetrain}
        disabled={isRetraining}
        className={`
          w-full py-3 px-4 rounded-lg font-medium text-white
          flex items-center justify-center gap-2 transition-all
          ${
            isRetraining
              ? "bg-textSecondary cursor-not-allowed"
              : "bg-primary hover:bg-secondary"
          }
        `}
      >
        {isRetraining ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Reentrenando modelo...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Iniciar Reentrenamiento
          </>
        )}
      </button>

      <p className="text-xs text-textSecondary mt-3 text-center">
        El proceso puede tardar varios minutos
      </p>
    </div>
  );
}
