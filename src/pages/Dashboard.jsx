import { Activity, Scale, AlertTriangle, Database } from "lucide-react";
import KPICard from "../components/ui/KPICard";
import LossIndexChart from "../components/charts/LossIndexChart";
import TopValvesTable from "../components/ui/TopValvesTable";
import SystemHealthIndicator from "../components/ui/SystemHealthIndicator";

export default function Dashboard() {
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
            value="47"
            unit="válvulas"
            trend="up"
            trendValue="+3"
            icon={Activity}
            color="primary"
          />
          <KPICard
            title="Índice Promedio de Pérdidas"
            value="9.2"
            unit="%"
            trend="down"
            trendValue="-1.2%"
            icon={Scale}
            color="success"
          />
          <KPICard
            title="Alertas Activas"
            value="5"
            unit="alertas"
            trend="up"
            trendValue="+2"
            icon={AlertTriangle}
            color="warning"
          />
          <KPICard
            title="Volumen Procesado"
            value="1.2M"
            unit="m³"
            trend="up"
            trendValue="+5.3%"
            icon={Database}
            color="secondary"
          />
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LossIndexChart />
          </div>
          <div>
            <SystemHealthIndicator healthScore={85} />
          </div>
        </section>

        {/* Top Valves Table */}
        <section>
          <TopValvesTable />
        </section>
      </div>
    </div>
  );
}
