import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Genera un reporte PDF de balances para una válvula específica
 * @param {string} valveId - ID de la válvula
 * @param {Array} data - Array de datos de balances
 * @param {Object} kpis - Objeto con KPIs (opcional)
 */
/**
 * Colores del proyecto
 */
const colors = {
  primary: [0, 143, 76], // #008f4c
  secondary: [46, 125, 95], // #2e7d5f
  accent: [242, 201, 76], // #f2c94c
  textMain: [51, 51, 51], // #333333
  textSecondary: [130, 130, 130], // #828282
  backgroundSecondary: [245, 245, 245], // #f5f5f5
  border: [224, 224, 224], // #e0e0e0
};

// Helper para formatear fecha
const formatPeriodo = (periodo) => {
  if (!periodo) return "N/A";
  const year = periodo.substring(0, 4);
  const month = periodo.substring(4, 6);
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return `${meses[parseInt(month) - 1]} ${year}`;
};

/**
 * Agrega el contenido de una válvula al documento PDF
 */
const addValveContent = (doc, valveId, data, kpis, startY = 22) => {
  // --- Encabezado de Sección ---
  doc.setFontSize(16);
  doc.setTextColor(...colors.primary);
  doc.text(`Válvula: ${valveId}`, 14, startY);

  // --- KPIs (Resumen) ---
  let currentY = startY + 10;
  if (kpis) {
    doc.setFontSize(12);
    doc.setTextColor(...colors.textMain);
    doc.text("Resumen de KPIs", 14, currentY);

    const kpiData = [
      ["Total Pérdidas", `${kpis.total_perdidas?.toLocaleString()} m³`],
      ["Índice Promedio", `${kpis.indice_promedio?.toFixed(2)} %`],
      ["Eficiencia", `${(100 - (kpis.indice_promedio || 0)).toFixed(2)} %`],
    ];

    autoTable(doc, {
      startY: currentY + 5,
      head: [["Métrica", "Valor"]],
      body: kpiData,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 2, textColor: colors.textMain },
      headStyles: { fontStyle: "bold", textColor: colors.primary },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 50 } },
      margin: { left: 14 },
    });
    currentY = doc.lastAutoTable.finalY + 10;
  }

  // --- Tabla de Datos ---
  doc.setFontSize(12);
  doc.setTextColor(...colors.textMain);
  doc.text("Detalle de Balances", 14, currentY);

  const tableColumn = [
    "Período",
    "Vol. Entrada (m³)",
    "Vol. Salida (m³)",
    "Pérdidas (m³)",
    "Índice (%)",
    "Tipo",
  ];

  const tableRows = data.map((item) => [
    formatPeriodo(item.periodo),
    item.entrada?.toLocaleString() || "-",
    item.salida?.toLocaleString() || "-",
    item.perdidas?.toLocaleString() || "-",
    item.indice ? `${item.indice.toFixed(2)}%` : "-",
    item.es_pronostico ? "Predicho" : "Real",
  ]);

  autoTable(doc, {
    startY: currentY + 5,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    headStyles: { fillColor: colors.primary, textColor: 255 },
    styles: { fontSize: 9, cellPadding: 3, textColor: colors.textMain },
    alternateRowStyles: { fillColor: colors.backgroundSecondary },
  });
};

/**
 * Genera un reporte PDF de balances para una válvula específica
 */
export const generateBalanceReport = (valveId, data, kpis) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  // Título Principal
  doc.setFontSize(20);
  doc.setTextColor(...colors.primary);
  doc.text("Reporte de Balances", 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(...colors.textSecondary);
  doc.text(`Generado el: ${date}`, 14, 22);

  // Contenido
  addValveContent(doc, valveId, data, kpis, 35);

  // Pie de página
  addPageNumbers(doc);

  doc.save(
    `Reporte_Balances_${valveId}_${new Date().toISOString().split("T")[0]}.pdf`
  );
};

/**
 * Genera un reporte PDF consolidado para múltiples válvulas
 * @param {Array} valvesData - Array de objetos { id, data, kpis }
 */
export const generateFullReport = (valvesData) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  // Portada o Encabezado General
  doc.setFontSize(22);
  doc.setTextColor(...colors.primary);
  doc.text("Reporte Consolidado de Balances", 14, 20);

  doc.setFontSize(12);
  doc.setTextColor(...colors.textSecondary);
  doc.text(`Generado el: ${date}`, 14, 30);
  doc.text(`Total Válvulas: ${valvesData.length}`, 14, 38);

  let startY = 50;

  valvesData.forEach((valve, index) => {
    if (index > 0) {
      doc.addPage();
      startY = 20;
    }
    addValveContent(doc, valve.id, valve.data, valve.kpis, startY);
  });

  addPageNumbers(doc);

  doc.save(`Reporte_Consolidado_${new Date().toISOString().split("T")[0]}.pdf`);
};

const addPageNumbers = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...colors.textSecondary);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }
};
