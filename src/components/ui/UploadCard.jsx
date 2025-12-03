import { useState } from "react";
import { Upload, FileText, CheckCircle, XCircle, Loader } from "lucide-react";

export default function UploadCard({
  title,
  description,
  acceptedFormats = ".csv,.xlsx",
  onUpload,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', 'loading', null

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleFile = (selectedFile) => {
    setFile(selectedFile);
    setUploadStatus(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus("loading");

    try {
      // Simular llamada al backend
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (onUpload) {
        await onUpload(file);
      }

      setUploadStatus("success");

      // Resetear después de 3 segundos
      setTimeout(() => {
        setFile(null);
        setUploadStatus(null);
      }, 3000);
    } catch (error) {
      setUploadStatus("error");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border">
      <h3 className="text-lg font-semibold text-textMain mb-2">{title}</h3>
      <p className="text-sm text-textSecondary mb-4">{description}</p>

      {/* Zona de Drop */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploadStatus === "loading" ? (
          <div className="flex flex-col items-center">
            <Loader className="w-12 h-12 text-primary animate-spin mb-3" />
            <p className="text-sm text-textSecondary">Cargando archivo...</p>
          </div>
        ) : uploadStatus === "success" ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-success mb-3" />
            <p className="text-sm font-medium text-success">
              ¡Archivo cargado exitosamente!
            </p>
          </div>
        ) : uploadStatus === "error" ? (
          <div className="flex flex-col items-center">
            <XCircle className="w-12 h-12 text-error mb-3" />
            <p className="text-sm font-medium text-error">
              Error al cargar el archivo
            </p>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center">
            <FileText className="w-12 h-12 text-primary mb-3" />
            <p className="text-sm font-medium text-textMain mb-1">
              {file.name}
            </p>
            <p className="text-xs text-textSecondary mb-4">
              {(file.size / 1024).toFixed(2)} KB
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors text-sm font-medium"
              >
                Subir Archivo
              </button>
              <button
                onClick={() => setFile(null)}
                className="px-4 py-2 bg-backgroundSecondary text-textSecondary rounded-lg hover:bg-border transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-textSecondary mx-auto mb-3" />
            <p className="text-sm text-textMain mb-2">
              Arrastra tu archivo aquí o{" "}
              <label className="text-primary cursor-pointer hover:underline font-medium">
                selecciona uno
                <input
                  type="file"
                  className="hidden"
                  accept={acceptedFormats}
                  onChange={handleFileInput}
                />
              </label>
            </p>
            <p className="text-xs text-textSecondary">
              Formatos aceptados: {acceptedFormats}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
