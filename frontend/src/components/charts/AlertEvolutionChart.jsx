import { memo, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = memo(({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-border">
        <p className="text-sm font-semibold text-textMain mb-2">
          {payload[0].payload.mes}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
        <p className="text-xs text-textSecondary mt-2 pt-2 border-t border-border">
          Total:{" "}
          <span className="font-semibold text-textMain">
            {payload.reduce((sum, entry) => sum + entry.value, 0)}
          </span>
        </p>
      </div>
    );
  }
  return null;
});

const AlertEvolutionChart = memo(function AlertEvolutionChart() {
  const data = useMemo(
    () => [
      {
        mes: "Ene",
        desbalance: 8,
        anomalia: 3,
        criticas: 5,
        altas: 4,
        medias: 2,
      },
      {
        mes: "Feb",
        desbalance: 12,
        anomalia: 5,
        criticas: 7,
        altas: 6,
        medias: 4,
      },
      {
        mes: "Mar",
        desbalance: 10,
        anomalia: 4,
        criticas: 6,
        altas: 5,
        medias: 3,
      },
      {
        mes: "Abr",
        desbalance: 15,
        anomalia: 7,
        criticas: 9,
        altas: 8,
        medias: 5,
      },
      {
        mes: "May",
        desbalance: 11,
        anomalia: 6,
        criticas: 7,
        altas: 6,
        medias: 4,
      },
      {
        mes: "Jun",
        desbalance: 9,
        anomalia: 4,
        criticas: 6,
        altas: 5,
        medias: 2,
      },
      {
        mes: "Jul",
        desbalance: 13,
        anomalia: 8,
        criticas: 10,
        altas: 7,
        medias: 4,
      },
      {
        mes: "Ago",
        desbalance: 14,
        anomalia: 6,
        criticas: 8,
        altas: 7,
        medias: 5,
      },
    ],
    []
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-textMain">
          Evolución de Alertas
        </h3>
        <p className="text-sm text-textSecondary">
          Cantidad de alertas generadas por tipo
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="mes" stroke="#6b7280" style={{ fontSize: "12px" }} />
          <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
          <Line
            type="monotone"
            dataKey="desbalance"
            name="Desbalance"
            stroke="#c0392b"
            strokeWidth={2}
            dot={{ fill: "#c0392b", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="anomalia"
            name="Anomalía"
            stroke="#f7b731"
            strokeWidth={2}
            dot={{ fill: "#f7b731", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-textSecondary">Total Generadas</p>
            <p className="text-xl font-bold text-textMain">146</p>
          </div>
          <div>
            <p className="text-xs text-textSecondary">Promedio Mensual</p>
            <p className="text-xl font-bold text-primary">18.3</p>
          </div>
          <div>
            <p className="text-xs text-textSecondary">Mes Pico</p>
            <p className="text-xl font-bold text-error">Julio (21)</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AlertEvolutionChart;
