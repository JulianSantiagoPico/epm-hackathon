import { memo } from "react";
import { Scale, TrendingDown, Calendar } from "lucide-react";
import KPICard from "./KPICard";

const BalanceKPIs = memo(function BalanceKPIs({ kpis }) {
  if (!kpis) return null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KPICard
        title="Índice Promedio de Pérdidas"
        value={kpis.indice_promedio.toFixed(1)}
        unit="%"
        icon={Scale}
        color="warning"
      />
      <KPICard
        title="Total Pérdidas"
        value={Math.abs(kpis.total_perdidas).toFixed(0)}
        unit="m³"
        icon={TrendingDown}
        color="error"
      />
      <KPICard
        title="Meses Analizados"
        value={kpis.meses_analizados.toString()}
        unit="períodos"
        icon={Calendar}
        color="primary"
      />
    </section>
  );
});

export default BalanceKPIs;
