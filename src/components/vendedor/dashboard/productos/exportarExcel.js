import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportarProductosPorPaginas = (productos, demandaPorProducto) => {
  const datos = productos.map((producto) => ({
    Fecha: formatFecha(producto.createdat),
    Nombre: producto.nombre,
    Descripción: producto.descripcion,
    Categoría: producto.categoriaNombre,
    'Cantidad Disponible': producto.cantidadDisponible,
    'Precio Compra': producto.precioCompra,
    'Precio Venta': producto.precioVenta,
    Histórico: producto.historico,
    'Días en Mercado': calcularDiasEnMercado(producto.createdat),
    Demanda: capitalizarDemanda(demandaPorProducto[producto.productoid] || 'Cargando...'),
  }));

  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Productos');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'Productos_Exportados.xlsx');
};

// Funciones auxiliares:
const formatFecha = (fecha) => {
  const f = new Date(fecha);
  const dia = String(f.getDate()).padStart(2, '0');
  const mes = String(f.getMonth() + 1).padStart(2, '0');
  const año = f.getFullYear();
  return `${dia}/${mes}/${año}`;
};

const calcularDiasEnMercado = (createdAt) => {
  const fechaNormalizada = createdAt.split('.')[0].replace(' ', 'T');
  const fechaCreacion = new Date(fechaNormalizada);
  if (isNaN(fechaCreacion)) return 'Fecha inválida';

  const hoy = new Date();
  const inicio = new Date(fechaCreacion.toDateString());
  const fin = new Date(hoy.toDateString());
  const diferenciaMs = fin - inicio;
  const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
  return dias >= 0 ? dias : 0;
};

const capitalizarDemanda = (demanda) => {
  if (!demanda) return '';
  return demanda.charAt(0).toUpperCase() + demanda.slice(1);
};
