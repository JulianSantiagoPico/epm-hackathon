import UploadCard from "../components/ui/UploadCard";
import DataStatusCard from "../components/ui/DataStatusCard";
import RetrainModelCard from "../components/ui/RetrainModelCard";
import LogsTable from "../components/ui/LogsTable";

export default function Admin() {
  const handleUploadMacro = async (file) => {
    console.log("Uploading macromedición:", file);
    // TODO: Conectar con backend
  };

  const handleUploadUsers = async (file) => {
    console.log("Uploading usuarios:", file);
    // TODO: Conectar con backend
  };

  const handleUploadBalances = async (file) => {
    console.log("Uploading balances:", file);
    // TODO: Conectar con backend
  };

  return (
    <div className="min-h-screen bg-backgroundSecondary">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-textMain mb-2">
            Gestión de Datos
          </h1>
          <p className="text-textSecondary">
            Carga de archivos, monitoreo de ingesta y reentrenamiento de modelos
            predictivos
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Sección 1: Carga de Archivos */}
        <section>
          <h2 className="text-xl font-semibold text-textMain mb-4">
            1. Carga de Datos
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <UploadCard
              title="Macromedición"
              description="Datos de medición tele gestionada (presión, temperatura, volumen)"
              acceptedFormats=".csv,.xlsx"
              onUpload={handleUploadMacro}
            />
            <UploadCard
              title="Usuarios"
              description="Datos de consumo facturado y características de clientes"
              acceptedFormats=".csv,.xlsx"
              onUpload={handleUploadUsers}
            />
            <UploadCard
              title="Balances"
              description="Balances históricos y cálculo de pérdidas"
              acceptedFormats=".csv,.xlsx"
              onUpload={handleUploadBalances}
            />
          </div>
        </section>

        {/* Sección 2: Estado de Datos */}
        <section>
          <h2 className="text-xl font-semibold text-textMain mb-4">
            2. Estado de Ingesta
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DataStatusCard
              type="macromeasurement"
              lastUpdate="2025-12-02"
              recordCount={15240}
              status="success"
            />
            <DataStatusCard
              type="users"
              lastUpdate="2025-12-01"
              recordCount={8450}
              status="success"
            />
            <DataStatusCard
              type="balances"
              lastUpdate="2025-11-30"
              recordCount={320}
              status="success"
            />
          </div>
        </section>

        {/* Sección 3: Reentrenamiento */}
        <section>
          <h2 className="text-xl font-semibold text-textMain mb-4">
            3. Modelo Predictivo
          </h2>
          <div className="max-w-md">
            <RetrainModelCard
              lastTraining="2025-12-01 14:30"
              currentMetrics={{
                mae: "0.042",
                rmse: "0.068",
              }}
            />
          </div>
        </section>

        {/* Sección 4: Logs */}
        <section>
          <h2 className="text-xl font-semibold text-textMain mb-4">
            4. Historial de Operaciones
          </h2>
          <LogsTable />
        </section>
      </div>
    </div>
  );
}
