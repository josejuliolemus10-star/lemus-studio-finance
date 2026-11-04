import ExcelJS from 'exceljs';

export const exportToExcel = async ({
  transactions = [],
  websites = [],
  calendarEvents = [],
  projects = [],
  clients = [],
}) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Lemus Studio Financial Suite';
  workbook.lastModifiedBy = 'Julio Lemus';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Paleta de estilos corporativa Black & White
  const headerFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF141414' }, // Negro puro
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

  // ----------------------------------------------------
  // HOJA 1: RESUMEN EJECUTIVO (KPIs & Saldo BAC)
  // ----------------------------------------------------
  const wsSummary = workbook.addWorksheet('📊 Resumen Financiero', {
    views: [{ showGridLines: true }],
  });

  wsSummary.columns = [
    { width: 5 },
    { width: 32 },
    { width: 22 },
    { width: 30 },
  ];

  // Banner Superior
  wsSummary.mergeCells('B2:D2');
  const titleCell = wsSummary.getCell('B2');
  titleCell.value = 'LEMUS STUDIO — RESUMEN EJECUTIVO';
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = headerFill;
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  wsSummary.getRow(2).height = 36;

  wsSummary.mergeCells('B3:D3');
  const subCell = wsSummary.getCell('B3');
  subCell.value = `Auditoría privada generada el: ${new Date().toLocaleDateString('es-GT', { dateStyle: 'full' })}`;
  subCell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF6B7280' } };
  subCell.alignment = { vertical: 'middle', horizontal: 'center' };
  wsSummary.getRow(3).height = 20;

  // Cálculos
  const totalInc = transactions.filter((t) => t.tipo === 'ingreso').reduce((s, t) => s + t.monto, 0);
  const totalExp = transactions.filter((t) => t.tipo === 'gasto').reduce((s, t) => s + t.monto, 0);
  const net = totalInc - totalExp;

  const kpis = [
    ['Saldo Disponible (BAC Credomatic)', net, 'Q#,##0.00', 'FF000000'],
    ['Ingresos Totales Registrados', totalInc, 'Q#,##0.00', 'FF15803D'],
    ['Gastos Totales Registrados', totalExp, 'Q#,##0.00', 'FFB91C1C'],
    ['Margen Neto Disponible', totalInc > 0 ? net / totalInc : 0, '0.0%', 'FF1F2937'],
    ['Proyectos Web en Desarrollo', projects.length, '#,##0', 'FF1F2937'],
    ['Clientes en Cartera CRM', clients.length, '#,##0', 'FF1F2937'],
    ['Páginas Web en Biblioteca', websites.length, '#,##0', 'FF1F2937'],
    ['Citas & Eventos en Agenda', calendarEvents.length, '#,##0', 'FF1F2937'],
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

  // ----------------------------------------------------
  // HOJA 2: TRANSACCIONES (TABLA BONITA & FORMATEADA)
  // ----------------------------------------------------
  const wsTx = workbook.addWorksheet('💸 Transacciones', {
    views: [{ showGridLines: true }],
  });

  wsTx.columns = [
    { header: 'ID Movimiento', key: 'id', width: 16 },
    { header: 'Tipo', key: 'tipo', width: 14 },
    { header: 'Monto (GTQ)', key: 'monto', width: 20 },
    { header: 'Fecha', key: 'fecha', width: 16 },
    { header: 'Motivo / Concepto', key: 'motivo', width: 38 },
    { header: 'Categoría', key: 'categoria', width: 22 },
    { header: 'Detalle / Proveedor', key: 'subinfo', width: 30 },
  ];

  // Estilo de Cabecera
  const txHeaderRow = wsTx.getRow(1);
  txHeaderRow.height = 30;
  txHeaderRow.eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Filas de datos
  transactions.forEach((t, i) => {
    const isInc = t.tipo === 'ingreso';
    const row = wsTx.addRow({
      id: t.id,
      tipo: isInc ? 'Ingreso (+)' : 'Gasto (-)',
      monto: t.monto,
      fecha: t.fecha,
      motivo: t.motivo,
      categoria: t.categoria || 'General',
      subinfo: t.subinfo || t.id_cliente_o_proveedor || '-',
    });

    row.height = 22;
    const bg = i % 2 === 0 ? 'FFFFFFFF' : 'FFF9FAFB';

    row.eachCell((cell, colNumber) => {
      cell.border = borderThin;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { vertical: 'middle', horizontal: 'left' };

      // Monto formateado
      if (colNumber === 3) {
        cell.numFmt = '"Q"#,##0.00;[Red]-"Q"#,##0.00';
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.font = { name: 'Calibri', bold: true, color: { argb: isInc ? 'FF15803D' : 'FF1F2937' } };
      }

      // ID y Fecha centrados
      if (colNumber === 1 || colNumber === 4) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }

      // Badge de tipo
      if (colNumber === 2) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { name: 'Calibri', bold: true, color: { argb: isInc ? 'FF15803D' : 'FFB91C1C' } };
      }
    });
  });

  // Fila de Totales con fórmula y borde doble
  const totalRowNumber = transactions.length + 2;
  const rowTotales = wsTx.getRow(totalRowNumber);
  rowTotales.height = 28;

  wsTx.getCell(`B${totalRowNumber}`).value = 'TOTAL NETO:';
  wsTx.getCell(`B${totalRowNumber}`).font = { name: 'Calibri', size: 11, bold: true };
  wsTx.getCell(`B${totalRowNumber}`).alignment = { vertical: 'middle', horizontal: 'right' };

  const cMontoTotal = wsTx.getCell(`C${totalRowNumber}`);
  cMontoTotal.value = net;
  cMontoTotal.numFmt = '"Q"#,##0.00';
  cMontoTotal.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF000000' } };
  cMontoTotal.border = borderTotal;
  cMontoTotal.alignment = { vertical: 'middle', horizontal: 'right' };

  wsTx.getCell(`E${totalRowNumber}`).value = `Saldo disponible BAC: Q ${net.toFixed(2)}`;
  wsTx.getCell(`E${totalRowNumber}`).font = { name: 'Calibri', italic: true, bold: true, color: { argb: 'FF4B5563' } };

  // ----------------------------------------------------
  // HOJA 3: PROYECTOS
  // ----------------------------------------------------
  const wsProj = workbook.addWorksheet('🚀 Proyectos', { views: [{ showGridLines: true }] });
  wsProj.columns = [
    { header: 'ID Proyecto', key: 'id', width: 16 },
    { header: 'Nombre del Proyecto', key: 'nombre', width: 34 },
    { header: 'Cliente Asignado', key: 'cliente', width: 28 },
    { header: 'Presupuesto (GTQ)', key: 'presupuesto', width: 20 },
    { header: 'Progreso', key: 'progreso', width: 16 },
    { header: 'Estado', key: 'estado', width: 18 },
    { header: 'Fecha de Entrega', key: 'fecha_entrega', width: 18 },
    { header: 'Stack / Tecnología', key: 'tecnologia', width: 30 },
  ];

  wsProj.getRow(1).height = 30;
  wsProj.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  projects.forEach((p, i) => {
    const row = wsProj.addRow({
      id: p.id,
      nombre: p.nombre,
      cliente: p.cliente || p.id_cliente,
      presupuesto: p.presupuesto || 0,
      progreso: `${p.progreso}%`,
      estado: p.estado,
      fecha_entrega: p.fecha_entrega,
      tecnologia: p.tecnologia || 'React, Tailwind CSS',
    });

    row.height = 22;
    const bg = i % 2 === 0 ? 'FFFFFFFF' : 'FFF9FAFB';

    row.eachCell((cell, colNumber) => {
      cell.border = borderThin;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { vertical: 'middle', horizontal: 'left' };

      if (colNumber === 4) {
        cell.numFmt = '"Q"#,##0.00';
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.font = { name: 'Calibri', bold: true };
      }
      if (colNumber === 1 || colNumber === 5 || colNumber === 6 || colNumber === 7) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
    });
  });

  // ----------------------------------------------------
  // HOJA 4: CLIENTES & CRM
  // ----------------------------------------------------
  const wsCli = workbook.addWorksheet('👥 Clientes & Leads', { views: [{ showGridLines: true }] });
  wsCli.columns = [
    { header: 'ID Cliente', key: 'id', width: 16 },
    { header: 'Empresa', key: 'empresa', width: 32 },
    { header: 'Persona de Contacto', key: 'nombre', width: 28 },
    { header: 'Teléfono / Correo', key: 'contacto', width: 30 },
    { header: 'Estado en Pipeline', key: 'estado', width: 20 },
  ];

  wsCli.getRow(1).height = 30;
  wsCli.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  clients.forEach((c, i) => {
    const row = wsCli.addRow({
      id: c.id,
      empresa: c.empresa,
      nombre: c.nombre,
      contacto: c.contacto,
      estado: c.estado,
    });

    row.height = 22;
    const bg = i % 2 === 0 ? 'FFFFFFFF' : 'FFF9FAFB';

    row.eachCell((cell, colNumber) => {
      cell.border = borderThin;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
      if (colNumber === 1 || colNumber === 5) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
    });
  });

  // ----------------------------------------------------
  // HOJA 5: PÁGINAS WEB CREADAS (CATÁLOGO PARA RECICLAJE)
  // ----------------------------------------------------
  const wsWeb = workbook.addWorksheet('🌐 Páginas Web', { views: [{ showGridLines: true }] });
  wsWeb.columns = [
    { header: 'ID Web', key: 'id', width: 14 },
    { header: 'Título del Sitio', key: 'titulo', width: 34 },
    { header: 'Cliente / Propietario', key: 'cliente', width: 28 },
    { header: 'Enlace URL', key: 'url', width: 32 },
    { header: 'Categoría', key: 'categoria', width: 20 },
    { header: 'Componentes Reciclables & Notas', key: 'descripcion', width: 45 },
  ];

  wsWeb.getRow(1).height = 30;
  wsWeb.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  websites.forEach((w, i) => {
    const row = wsWeb.addRow({
      id: w.id,
      titulo: w.titulo,
      cliente: w.cliente,
      url: w.url,
      categoria: w.categoria,
      descripcion: w.descripcion,
    });

    row.height = 24;
    const bg = i % 2 === 0 ? 'FFFFFFFF' : 'FFF9FAFB';

    row.eachCell((cell, colNumber) => {
      cell.border = borderThin;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
      if (colNumber === 1 || colNumber === 5) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
    });
  });

  // ----------------------------------------------------
  // HOJA 6: CALENDARIO & CITAS
  // ----------------------------------------------------
  const wsCal = workbook.addWorksheet('📅 Calendario & Citas', { views: [{ showGridLines: true }] });
  wsCal.columns = [
    { header: 'ID Cita', key: 'id', width: 14 },
    { header: 'Título del Evento', key: 'titulo', width: 34 },
    { header: 'Fecha', key: 'fecha', width: 16 },
    { header: 'Horario', key: 'horario', width: 18 },
    { header: 'Tipo', key: 'tipo', width: 20 },
    { header: 'Cliente Asociado', key: 'cliente', width: 26 },
    { header: 'Enlace Meet / Zoom', key: 'enlace', width: 32 },
    { header: 'Estado', key: 'estado', width: 16 },
  ];

  wsCal.getRow(1).height = 30;
  wsCal.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  calendarEvents.forEach((ev, i) => {
    const row = wsCal.addRow({
      id: ev.id,
      titulo: ev.titulo,
      fecha: ev.fecha,
      horario: `${ev.hora_inicio || ''} - ${ev.hora_fin || ''}`,
      tipo: ev.tipo,
      cliente: ev.cliente || 'Interno',
      enlace: ev.enlace || '-',
      estado: ev.completado ? 'Completado' : 'Pendiente',
    });

    row.height = 22;
    const bg = i % 2 === 0 ? 'FFFFFFFF' : 'FFF9FAFB';

    row.eachCell((cell, colNumber) => {
      cell.border = borderThin;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
      if (colNumber === 1 || colNumber === 3 || colNumber === 4 || colNumber === 8) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
    });
  });

  // ----------------------------------------------------
  // EXPORTAR Y DESCARGAR ARCHIVO (.XLSX)
  // ----------------------------------------------------
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Lemus_Studio_Finanzas_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
