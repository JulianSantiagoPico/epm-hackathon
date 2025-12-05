import { useState, useEffect, useMemo, useCallback } from "react";
import { Loader2, FileDown, Files, Bot, X } from "lucide-react";
import BalanceTable from "../components/ui/BalanceTable";
import BalanceChart from "../components/charts/BalanceChart";
import BalanceKPIs from "../components/ui/BalanceKPIs";
import ValveSelector from "../components/ui/ValveSelector";
import { balancesAPI } from "../services/api";
import {
  generateBalanceReport,
  generateFullReport,
} from "../utils/pdfGenerator";
import { useUserStore } from "../stores/userStore";

export default function Balances() {
  const { hasPermission } = useUserStore();
  const [selectedValve, setSelectedValve] = useState(null);
  const [valves, setValves] = useState([]);
  const [balanceData, setBalanceData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  // Mapeo de nombres de válvulas (memoizado)
  const valveNames = useMemo(
    () => ({
      VALVULA_1: { name: "Válvula Sector 1", location: "Sector Norte" },
      VALVULA_2: { name: "Válvula Sector 2", location: "Sector Centro" },
      VALVULA_3: { name: "Válvula Sector 3", location: "Sector Sur" },
      VALVULA_4: { name: "Válvula Sector 4", location: "Sector Este" },
      VALVULA_5: { name: "Válvula Sector 5", location: "Sector Oeste" },
    }),
    []
  );

  // Cargar lista de válvulas al montar el componente (memoizado)
  // Cargar lista de válvulas al montar el componente
  useEffect(() => {
    const fetchValves = async () => {
      try {
        setInitialLoading(true);
        const response = await balancesAPI.listValves();
        const valvulasList = response.valvulas || [];
        setValves(valvulasList);

        // Seleccionar la primera válvula por defecto si no hay ninguna seleccionada
        if (valvulasList.length > 0) {
          setSelectedValve((prev) => prev || valvulasList[0]);
        }
      } catch (err) {
        console.error("Error al cargar válvulas:", err);
        setError("No se pudieron cargar las válvulas");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchValves();
  }, []);

  // Cargar datos de balance cuando cambia la válvula seleccionada (memoizado)
  const fetchBalanceData = useCallback(async () => {
    if (!selectedValve) return;

    try {
      // Solo mostrar loading si no hay datos previos
      setDataLoading(true);
      setError(null);
      const data = await balancesAPI.getByValve(selectedValve);
      setBalanceData(data);
    } catch (err) {
      console.error("Error al cargar balances:", err);
      setError("No se pudieron cargar los datos de balance");
    } finally {
      setDataLoading(false);
    }
  }, [selectedValve]);

  useEffect(() => {
    fetchBalanceData();
  }, [fetchBalanceData]);

  // Handler memoizado para selección de válvula
  const handleValveSelect = useCallback((valveId) => {
    setSelectedValve(valveId);
  }, []);

  const handleExportPDF = () => {
    if (balanceData && selectedValve) {
      generateBalanceReport(
        selectedValve,
        balanceData.balances,
        balanceData.kpis
      );
    }
  };

  const handleExportAll = async () => {
    if (valves.length === 0) return;

    try {
      setIsExportingAll(true);
      const promises = valves.map(async (valveId) => {
        const data = await balancesAPI.getByValve(valveId);
        return {
          id: valveId,
          data: data.balances,
          kpis: data.kpis,
        };
      });

      const allData = await Promise.all(promises);
      generateFullReport(allData);
    } catch (err) {
      console.error("Error al exportar reporte completo:", err);
      // Podrías mostrar un toast o alerta aquí
    } finally {
      setIsExportingAll(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedValve) return;

    try {
      setIsAnalyzing(true);
      const response = await balancesAPI.analyze(selectedValve);
      setAnalysisResult(response.analysis);
    } catch (err) {
      console.error("Error al analizar con IA:", err);
      setError(
        "No se pudo generar el análisis. Verifica la configuración de API Key."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-backgroundSecondary">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-textMain mb-2">
              Balances por Válvula
            </h1>
            <p className="text-textSecondary">
              Consulta de balances virtuales y reales por punto de medición
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedValve}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border border-accent text-accent hover:bg-accent/10
                ${
                  isAnalyzing || !selectedValve
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              `}
            >
              {isAnalyzing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
              {isAnalyzing ? "Analizando..." : "Analizar con IA"}
            </button>

            {hasPermission("canExportReports") && (
              <>
                <button
                  onClick={handleExportAll}
                  disabled={isExportingAll || valves.length === 0}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border border-primary text-primary hover:bg-primary/5
                    ${
                      isExportingAll || valves.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  `}
                >
                  {isExportingAll ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Files className="w-5 h-5" />
                  )}
                  {isExportingAll ? "Generando..." : "Exportar Todo"}
                </button>

                <button
                  onClick={handleExportPDF}
                  disabled={!balanceData}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                    ${
                      balanceData
                        ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  <FileDown className="w-5 h-5" />
                  Exportar PDF
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Análisis IA */}
      {analysisResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Bot className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-textMain">
                  Análisis Inteligente de Balances
                </h3>
              </div>
              <button
                onClick={() => setAnalysisResult(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-textSecondary" />
              </button>
            </div>
            <div className="p-6">
              <div className="prose prose-sm max-w-none text-textMain whitespace-pre-line leading-relaxed">
                {analysisResult}
              </div>
            </div>
            <div className="p-6 border-t border-border bg-gray-50 rounded-b-xl">
              <p className="text-xs text-textSecondary text-center">
                Análisis generado por IA. Verificar siempre con datos de campo.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Estado de carga inicial */}
        {initialLoading && valves.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-textSecondary">
              Cargando válvulas...
            </span>
          </div>
        )}

        {error && !balanceData && (
          <div className="bg-error/10 border border-error rounded-lg p-4">
            <p className="text-error font-medium">{error}</p>
          </div>
        )}

        {/* Selector de Válvula */}
        {!initialLoading && valves.length > 0 && (
          <>
            <ValveSelector
              valves={valves}
              selectedValve={selectedValve}
              onValveSelect={handleValveSelect}
              valveNames={valveNames}
            />

            {/* Indicador de carga sutil */}

            {/* Contenedor con transición suave */}
            <div
              className={
                dataLoading
                  ? "opacity-50 pointer-events-none transition-opacity duration-300"
                  : "opacity-100 transition-opacity duration-300"
              }
            >
              {/* KPIs de la válvula seleccionada */}
              <BalanceKPIs kpis={balanceData?.kpis} />

              {/* Gráfico de Balances */}
              {balanceData && (
                <section className="mt-6">
                  <BalanceChart data={balanceData.balances} />
                </section>
              )}

              {/* Tabla de Balances */}
              {balanceData && (
                <section className="mt-6">
                  <BalanceTable
                    valveId={selectedValve}
                    data={balanceData.balances}
                    kpis={balanceData.kpis}
                  />
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
