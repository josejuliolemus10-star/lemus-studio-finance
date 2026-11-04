const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function generateMasterExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Lemus Studio Financial Suite';
  workbook.lastModifiedBy = 'Julio Lemus';
  workbook.created = new Date();
  workbook.modified = new Date();

  const headerFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF141414' },
  };

  const headerFont = {
    name: 'Calibri',
    size: 11,
    bold: true,
    color: { argb: 'FFFFFFFF' },
  };

  const borderThin = {
    top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
    bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
    left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
    right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
  };

  const borderTotal = {
    top: { style: 'thin', color: { argb: 'FF000000' } },
    bottom: { style: 'double', color: { argb: 'FF000000' } },
  };

  // 1. Resumen
  const wsSummary = workbook.addWorksheet('📊 Resumen Financiero', { views: [{ showGridLines: true }] });
  wsSummary.columns = [{ width: 5 }, { width: 34 }, { width: 22 }, { width: 30 }];

  wsSummary.mergeCells('B2:D2');
  const titleCell = wsSummary.getCell('B2');
  titleCell.value = 'LEMUS STUDIO — RESUMEN EJECUTIVO';
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = headerFill;
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  wsSummary.getRow(2).height = 36;

  wsSummary.mergeCells('B3:D3');
  const subCell = wsSummary.getCell('B3');
  subCell.value = 'Auditoría privada generada para Julio Lemus (Lemus Studio)';
  subCell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF6B7280' } };
  subCell.alignment = { vertical: 'middle', horizontal: 'center' };
  wsSummary.getRow(3).height = 20;

  const kpis = [
    ['Saldo Disponible (BAC Credomatic)', 288.00, 'Q#,##0.00', 'FF000000'],
    ['Ingresos Totales Registrados', 905.00, 'Q#,##0.00', 'FF15803D'],
    ['Gastos Totales Registrados', 617.00, 'Q#,##0.00', 'FFB91C1C'],
    ['Margen Neto Disponible', 0.318, '0.0%', 'FF1F2937'],
    ['Proyectos Web en Desarrollo', 1, '#,##0', 'FF1F2937'],
    ['Clientes en Cartera CRM', 3, '#,##0', 'FF1F2937'],
    ['Páginas Web en Biblioteca', 3, '#,##0', 'FF1F2937'],
    ['Citas & Eventos en Agenda', 2, '#,##0', 'FF1F2937'],
  ];

  let rIdx = 5;
  kpis.forEach(([label, val, numFmt, col]) => {
    const row = wsSummary.getRow(rIdx);
    row.height = 24;

    const cLabel = wsSummary.getCell(`B${rIdx}`);
    cLabel.value = label;
    cLabel.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF374151' } };
    cLabel.border = borderThin;
    cLabel.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rIdx % 2 === 0 ? 'FFF9FAFB' : 'FFFFFFFF' } };

    const cVal = wsSummary.getCell(`C${rIdx}`);
    cVal.value = val;
    cVal.numFmt = numFmt;
    cVal.font = { name: 'Calibri', size: 12, bold: true, color: { argb: col } };
    cVal.alignment = { horizontal: 'right' };
    cVal.border = borderThin;
    cVal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rIdx % 2 === 0 ? 'FFF9FAFB' : 'FFFFFFFF' } };

    rIdx++;
  });

  // 2. Transacciones
  const wsTx = workbook.addWorksheet('💸 Transacciones', { views: [{ showGridLines: true }] });
  wsTx.columns = [
    { header: 'ID Movimiento', key: 'id', width: 16 },
    { header: 'Tipo', key: 'tipo', width: 14 },
    { header: 'Monto (GTQ)', key: 'monto', width: 20 },
    { header: 'Fecha', key: 'fecha', width: 16 },
    { header: 'Motivo / Concepto', key: 'motivo', width: 38 },
    { header: 'Categoría', key: 'categoria', width: 22 },
    { header: 'Detalle / Proveedor', key: 'subinfo', width: 30 },
  ];

  wsTx.getRow(1).height = 30;
  wsTx.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  const txs = [
    { id: 'tx-1', tipo: 'Gasto (-)', monto: 15.00, fecha: '2026-11-01', motivo: 'gasolina', categoria: 'Webs completas', subinfo: 'moto' },
    { id: 'tx-2', tipo: 'Gasto (-)', monto: 490.00, fecha: '2026-11-01', motivo: 'pago de microfono', categoria: 'Otros', subinfo: 'mi apa' },
    { id: 'tx-3', tipo: 'Gasto (-)', monto: 10.00, fecha: '2026-11-01', motivo: 'mi apa', categoria: 'Otros', subinfo: 'mi apa' },
    { id: 'tx-4', tipo: 'Gasto (-)', monto: 62.00, fecha: '2026-11-01', motivo: 'Pizza', categoria: 'Otros', subinfo: 'Con mi peloncita' },
    { id: 'tx-5', tipo: 'Gasto (-)', monto: 40.00, fecha: '2026-10-28', motivo: 'Taco Bell', categoria: 'Otros', subinfo: 'Mi peloncita' },
    { id: 'tx-6', tipo: 'Ingreso (+)', monto: 5.00, fecha: '2026-10-28', motivo: 'REGALO', categoria: 'Webs completas', subinfo: 'MI APA' },
    { id: 'tx-7', tipo: 'Ingreso (+)', monto: 900.00, fecha: '2026-10-28', motivo: 'Anticipo de pagina web 50%', categoria: 'Webs completas', subinfo: 'INMOBILIARIA SANTANDER' },
  ];

  txs.forEach((t, i) => {
    const isInc = t.tipo.includes('Ingreso');
    const row = wsTx.addRow(t);
    row.height = 22;
    const bg = i % 2 === 0 ? 'FFFFFFFF' : 'FFF9FAFB';

    row.eachCell((cell, colNumber) => {
      cell.border = borderThin;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { vertical: 'middle', horizontal: 'left' };

      if (colNumber === 3) {
        cell.numFmt = '"Q"#,##0.00;[Red]-"Q"#,##0.00';
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.font = { name: 'Calibri', bold: true, color: { argb: isInc ? 'FF15803D' : 'FF1F2937' } };
      }
      if (colNumber === 1 || colNumber === 4) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
      if (colNumber === 2) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { name: 'Calibri', bold: true, color: { argb: isInc ? 'FF15803D' : 'FFB91C1C' } };
      }
    });
  });

  const totalRow = txs.length + 2;
  wsTx.getRow(totalRow).height = 28;
  wsTx.getCell(`B${totalRow}`).value = 'SALDO BAC:';
  wsTx.getCell(`B${totalRow}`).font = { name: 'Calibri', size: 11, bold: true };
  wsTx.getCell(`B${totalRow}`).alignment = { vertical: 'middle', horizontal: 'right' };

  const cTotal = wsTx.getCell(`C${totalRow}`);
  cTotal.value = 288.00;
  cTotal.numFmt = '"Q"#,##0.00';
  cTotal.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF000000' } };
  cTotal.border = borderTotal;
  cTotal.alignment = { vertical: 'middle', horizontal: 'right' };

  wsTx.getCell(`E${totalRow}`).value = 'Saldo Disponible BAC Credomatic: Q 288.00';
  wsTx.getCell(`E${totalRow}`).font = { name: 'Calibri', italic: true, bold: true, color: { argb: 'FF4B5563' } };

  // Guardar archivo
  const out1 = path.join(__dirname, 'Lemus_Studio_Finanzas_Master.xlsx');
  const out2 = path.join(__dirname, 'public', 'Lemus_Studio_Finanzas_Master.xlsx');

  await workbook.xlsx.writeFile(out1);
  await workbook.xlsx.writeFile(out2);

  console.log('✅ Master Excel generado con diseño profesional en:');
  console.log('   - ' + out1);
  console.log('   - ' + out2);
}

generateMasterExcel().catch(console.error);
