import * as XLSX from 'xlsx';
import { formatGTQ, formatDate } from './formatters';

export const exportToExcel = ({ transactions = [], websites = [], calendarEvents = [], projects = [], clients = [] }) => {
  const wb = XLSX.utils.book_new();

  // 1. Hoja de Transacciones
  const txData = transactions.length > 0 ? transactions.map((t) => ({
    'ID': t.id,
    'Tipo': t.tipo === 'ingreso' ? 'Ingreso (+)' : 'Gasto (-)',
    'Monto (GTQ)': t.monto,
    'Fecha': t.fecha,
    'Motivo': t.motivo,
    'Categoría': t.categoria || '',
    'Cliente o Proveedor': t.id_cliente_o_proveedor || '',
  })) : [{ 'Mensaje': 'Sin transacciones registradas' }];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(txData), 'Transacciones');

  // 2. Hoja de Páginas Web Creadas (Catálogo & Reciclaje)
  const webData = websites.length > 0 ? websites.map((w) => ({
    'ID': w.id,
    'Título del Sitio': w.titulo,
    'Para Quién (Cliente)': w.cliente,
    'URL / Enlace': w.url,
    'Categoría': w.categoria,
    'Componentes Reciclables / Notas': w.descripcion || '',
    'Fecha de Creación': w.fecha || '',
  })) : [{ 'Mensaje': 'Sin páginas web registradas' }];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(webData), 'Paginas_Web');

  // 3. Hoja de Calendario & Citas
  const calData = calendarEvents.length > 0 ? calendarEvents.map((c) => ({
    'ID': c.id,
    'Título de la Cita': c.titulo,
    'Fecha': c.fecha,
    'Horario': `${c.hora_inicio || ''} - ${c.hora_fin || ''}`,
    'Tipo': c.tipo,
    'Cliente Asociado': c.cliente || '',
    'Enlace / Meet': c.enlace || '',
    'Estado': c.completado ? 'Completado' : 'Pendiente',
    'Notas': c.notas || '',
  })) : [{ 'Mensaje': 'Sin citas ni recordatorios programados' }];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(calData), 'Calendario_Citas');

  // 4. Hoja de Proyectos
  const projData = projects.length > 0 ? projects.map((p) => ({
    'ID': p.id,
    'Nombre del Proyecto': p.nombre,
    'ID Cliente': p.id_cliente,
    'Presupuesto (GTQ)': p.presupuesto,
    'Progreso (%)': p.progreso,
    'Estado': p.estado,
    'Fecha de Entrega': p.fecha_entrega,
    'Stack Tecnológico': p.tecnologia || '',
  })) : [{ 'Mensaje': 'Sin proyectos registrados' }];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(projData), 'Proyectos');

  // 5. Hoja de Clientes CRM
  const clientData = clients.length > 0 ? clients.map((c) => ({
    'ID': c.id,
    'Empresa': c.empresa,
    'Nombre de Contacto': c.nombre,
    'Teléfono / Email': c.contacto,
    'Estado Comercial': c.estado,
  })) : [{ 'Mensaje': 'Sin clientes registrados' }];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(clientData), 'Clientes_CRM');

  // Generar archivo y forzar descarga en el navegador
  const fileName = `Lemus_Studio_Finanzas_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
