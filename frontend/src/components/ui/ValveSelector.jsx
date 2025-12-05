import { memo, useMemo, useCallback, useState } from "react";
import { Search } from "lucide-react";
import ValveButton from "./ValveButton";

const ValveSelector = memo(function ValveSelector({
  valves,
  selectedValve,
  onValveSelect,
  valveNames,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Filtrado de válvulas (memoizado)
  const filteredValves = useMemo(() => {
    return valves.filter((valveId) => {
      const valveInfo = valveNames[valveId] || {};
      return (
        valveId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        valveInfo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        valveInfo.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [valves, searchTerm, valveNames]);

  // Memoizar información de válvulas para el grid
  const valveGridItems = useMemo(() => {
    return filteredValves.map((valveId) => ({
      id: valveId,
      info: valveNames[valveId] || {
        name: valveId,
        location: "Sin ubicación",
      },
    }));
  }, [filteredValves, valveNames]);

  return (
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
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Grid de válvulas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {valveGridItems.map((item) => (
          <ValveButton
            key={item.id}
            valveId={item.id}
            valveName={item.info.name}
            location={item.info.location}
            isSelected={selectedValve === item.id}
            onSelect={onValveSelect}
          />
        ))}
      </div>
    </section>
  );
});

export default ValveSelector;
