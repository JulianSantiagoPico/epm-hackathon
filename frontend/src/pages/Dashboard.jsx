import { useState, useEffect, useMemo, useCallback } from "react";
import { Activity, Scale, AlertTriangle, Database, Target } from "lucide-react";
import KPICard from "../components/ui/KPICard";
import LossIndexChart from "../components/charts/LossIndexChart";
import TopValvesTable from "../components/ui/TopValvesTable";
import SystemHealthIndicator from "../components/ui/SystemHealthIndicator";
import { dashboardAPI, reliabilityAPI, modelsAPI } from "../services/api";

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [lossIndexData, setLossIndexData] = useState([]);
  const [topValves, setTopValves] = useState([]);
  const [reliabilityData, setReliabilityData] = useState(null);
  const [bestModelsByValve, setBestModelsByValve] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Cargar datos en paralelo
      const [summary, reliability, bestModels] = await Promise.all([
        dashboardAPI.getSummary(),
        reliabilityAPI.getAll(),
        modelsAPI.getBestByValve?.() || Promise.resolve({ valves: [] }),
      ]);

      setKpis(summary.kpis);
      setLossIndexData(summary.loss_index_evolution);
      setTopValves(summary.top_valves);
      setReliabilityData(reliability);
      setBestModelsByValve(bestModels.valves || []);
    } catch (err) {
      console.error("Error al cargar dashboard:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Memorizar número de alertas activas (ANTES de returns condicionales)
  const alertasActivas = useMemo(() => {
    return topValves?.filter((v) => v.indice_perdidas > 12).length || 0;
  }, [topValves]);

  // Memorizar volumen procesado
  const volumenProcesado = useMemo(() => {
    return ((kpis?.perdidas_totales || 0) / 1000).toFixed(1);
  }, [kpis?.perdidas_totales]);

  // Memorizar health score
  const healthScore = useMemo(() => {
    if (!topValves || topValves.length === 0) {
      return reliabilityData?.promedio_score || 85;
    }

    const normal = topValves.filter((v) => v.indice_perdidas <= 12).length;
    const warning = topValves.filter(
      (v) => v.indice_perdidas > 12 && v.indice_perdidas <= 20
    ).length;
    const critical = topValves.filter((v) => v.indice_perdidas > 20).length;
    const total = topValves.length;

    // Score ponderado: normal=100, warning=70, critical=30
    const score = (normal * 100 + warning * 70 + critical * 30) / total;
    return Math.round(score);
  }, [topValves, reliabilityData]);

  // Returns condicionales DESPUÉS de todos los hooks
  if (loading) {
    return (
      <div className="min-h-screen bg-backgroundSecondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-textSecondary">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-backgroundSecondary flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
          <p className="text-textMain font-semibold mb-2">
            Error al cargar datos
          </p>
          <p className="text-textSecondary">{error}</p>
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
            Dashboard Ejecutivo
          </h1>
          <p className="text-textSecondary">
            Vista general de KPIs y métricas principales del sistema de balances
            virtuales
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPIs Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Válvulas Monitoreadas"
            value={kpis?.valvulas_monitoreadas || 0}
            unit="válvulas"
            icon={Activity}
            color="primary"
            trend={kpis?.valvulas_monitoreadas > 0 ? "+3" : null}
          />
          <KPICard
            title="Índice Promedio de Pérdidas"
            value={kpis?.indice_promedio?.toFixed(1) || "0.0"}
            unit="%"
            icon={Scale}
            color={kpis?.indice_promedio < 10 ? "success" : "warning"}
            trend={kpis?.indice_promedio < 10 ? "-1.2%" : "+2.3%"}
          />
          <KPICard
            title="Alertas Activas"
            value={alertasActivas}
            unit="alertas"
            icon={AlertTriangle}
            color="warning"
            trend={"+2"}
          />
          <KPICard
            title="Volumen Procesado"
            value={volumenProcesado}
            unit="k m³"
            icon={Database}
            color="secondary"
            trend="+5.3%"
          />
        </section>

        {/* New: Reliability Summary Banner */}
        {reliabilityData && (
          <section className="bg-linear-to-r from-primary to-accent rounded-lg shadow-md p-6 border border-border text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Target className="w-10 h-10" />
                <div>
                  <h3 className="text-xl font-bold">
                    Score Promedio de Confiabilidad:{" "}
                    {reliabilityData.promedio_score?.toFixed(0) || 0}%
                  </h3>
                  <p className="text-sm opacity-90">
                    {kpis?.modelos_unicos || 0} modelos diferentes usados -
                    Sistema multi-modelo adaptativo por válvula
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {kpis?.mejor_modelo || "N/A"}
                </div>
                <p className="text-sm opacity-90">Modelo más común</p>
              </div>
            </div>
          </section>
        )}

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LossIndexChart data={lossIndexData} />
          </div>
          <div>
            <SystemHealthIndicator
              healthScore={healthScore}
              bestModel={kpis?.mejor_modelo}
              reliabilityData={reliabilityData}
              topValves={topValves}
            />
          </div>
        </section>

        {/* Top Valves Table */}
        <section>
          <TopValvesTable data={topValves} />
        </section>
      </div>
    </div>
  );
}
