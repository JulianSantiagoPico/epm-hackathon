import { useState } from "react";
import { Search, Scale, TrendingDown, Calendar } from "lucide-react";
import BalanceTable from "../components/ui/BalanceTable";
import BalanceChart from "../components/charts/BalanceChart";
import KPICard from "../components/ui/KPICard";

export default function Balances() {
  const [selectedValve, setSelectedValve] = useState("V-402");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data de válvulas
  const valves = [
    { id: "V-402", name: "Válvula Anillo 402", location: "Sector Norte" },
    { id: "V-318", name: "Válvula Anillo 318", location: "Sector Centro" },
    { id: "V-125", name: "Válvula Anillo 125", location: "Sector Sur" },
    { id: "V-567", name: "Válvula Anillo 567", location: "Sector Este" },
    { id: "V-089", name: "Válvula Anillo 089", location: "Sector Oeste" },
  ];

  const filteredValves = valves.filter(
    (valve) =>
      valve.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      valve.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      valve.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-backgroundSecondary">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-textMain mb-2">
            Balances por Válvula
          </h1>
          <p className="text-textSecondary">
            Consulta de balances virtuales y reales por punto de medición
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Selector de Válvula */}
        <section className="bg-white rounded-lg shadow-md p-6 border border-border">
          <h3 className="text-lg font-semibold text-textMain mb-4">
            Seleccionar Válvula
          </h3>

          {/* Buscador */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
            <input
              type="text"
              placeholder="Buscar por ID, nombre o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Grid de válvulas */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {filteredValves.map((valve) => (
              <button
                key={valve.id}
                onClick={() => setSelectedValve(valve.id)}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${
                    selectedValve === valve.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50"
                  }
                `}
              >
                <p className="text-sm font-bold text-textMain">{valve.id}</p>
                <p className="text-xs text-textSecondary mt-1">{valve.name}</p>
                <p className="text-xs text-textSecondary mt-1">
                  📍 {valve.location}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* KPIs de la válvula seleccionada */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Índice Promedio de Pérdidas"
            value="9.2"
            unit="%"
            trend="down"
            trendValue="-0.8%"
            icon={Scale}
            color="warning"
          />
          <KPICard
            title="Total Pérdidas"
            value="9,607"
            unit="m³"
            trend="up"
            trendValue="+320 m³"
            icon={TrendingDown}
            color="error"
          />
          <KPICard
            title="Meses Analizados"
            value="8"
            unit="períodos"
            icon={Calendar}
            color="primary"
          />
        </section>

        {/* Gráfico de Balances */}
        <section>
          <BalanceChart />
        </section>

        {/* Tabla de Balances */}
        <section>
          <BalanceTable valveId={selectedValve} />
        </section>
      </div>
    </div>
  );
}
