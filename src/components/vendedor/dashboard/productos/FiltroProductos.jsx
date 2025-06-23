import React from 'react';

const FiltroProductos = ({ productosFiltrados, setProductos, orden, setOrden, demandaPorProducto }) => {
  const handleOrdenar = (columna) => {
    const nuevoOrden = orden[columna] === 'asc' ? 'desc' : 'asc';

    const nuevoEstadoOrden = {
      ...orden,  // Mantener el estado anterior para las demás columnas
      [columna]: nuevoOrden,  // Solo actualizar la columna seleccionada
    };
    setOrden(nuevoEstadoOrden);

    const productosOrdenados = [...productosFiltrados].sort((a, b) => {
      if (columna === 'fecha') {
        const fechaA = new Date(a.createdat.split('.')[0].replace(' ', 'T'));
        const fechaB = new Date(b.createdat.split('.')[0].replace(' ', 'T'));
        return nuevoOrden === 'asc' ? fechaA - fechaB : fechaB - fechaA;
      }
      if (columna === 'nombre') {
        const nombreA = a.nombre.toLowerCase();
        const nombreB = b.nombre.toLowerCase();
        return nuevoOrden === 'asc' ? nombreA.localeCompare(nombreB) : nombreB.localeCompare(nombreA);
      }
      if (columna === 'precioCompra') {
        return nuevoOrden === 'asc'
          ? a.precioCompra - b.precioCompra
          : b.precioCompra - a.precioCompra;
      }
      if (columna === 'precioVenta') {
        return nuevoOrden === 'asc'
          ? a.precioVenta - b.precioVenta
          : b.precioVenta - a.precioVenta;
      }
      if (columna === 'cantidadDisponible') {
        return nuevoOrden === 'asc'
          ? a.cantidadDisponible - b.cantidadDisponible
          : b.cantidadDisponible - a.cantidadDisponible;
      }
      if (columna === 'diasMercado') {
        const diasA = calcularDiasEnMercado(a.createdat);
        const diasB = calcularDiasEnMercado(b.createdat);
        return nuevoOrden === 'asc' ? diasA - diasB : diasB - diasA;
      }
      if (columna === 'categoriaNombre') { // Ordenar por categoría
        const categoriaA = a.categoriaNombre.toLowerCase();
        const categoriaB = b.categoriaNombre.toLowerCase();
        return nuevoOrden === 'asc' ? categoriaA.localeCompare(categoriaB) : categoriaB.localeCompare(categoriaA);
      }
      if (columna === 'demanda') { // Ordenar por demanda
        const demandaA = demandaPorProducto[a.productoid]?.toLowerCase();
        const demandaB = demandaPorProducto[b.productoid]?.toLowerCase();
        return nuevoOrden === 'asc'
          ? demandaA.localeCompare(demandaB)
          : demandaB.localeCompare(demandaA);
      }
      if (columna === 'historico') {  // Ordenar por Histórico
        const historicoA = a.historico;  // Ajusta si tienes otro campo
        const historicoB = b.historico;  // Ajusta si tienes otro campo
        return nuevoOrden === 'asc' ? historicoA - historicoB : historicoB - historicoA;
      }

    });

    setProductos(productosOrdenados);
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

  // Función para capitalizar la primera letra de la demanda
  const capitalizarDemanda = (demanda) => {
    if (!demanda) return '';
    return demanda.charAt(0).toUpperCase() + demanda.slice(1); // Primera letra en mayúsculas
  };

  return (
    <thead>
      <tr>
        <th onClick={() => handleOrdenar('fecha')} style={{ cursor: 'pointer' }}>
          Fecha de Creación {orden.fecha === 'asc' ? '↑' : orden.fecha === 'desc' ? '↓' : ''}
        </th>
        <th onClick={() => handleOrdenar('nombre')} style={{ cursor: 'pointer' }}>
          Nombre {orden.nombre === 'asc' ? '↑' : orden.nombre === 'desc' ? '↓' : ''}
        </th>
        <th>Descripción</th>
        <th onClick={() => handleOrdenar('categoriaNombre')} style={{ cursor: 'pointer' }}>
          Categoría {orden.categoriaNombre === 'asc' ? '↑' : orden.categoriaNombre === 'desc' ? '↓' : ''}
        </th>
        <th onClick={() => handleOrdenar('cantidadDisponible')} style={{ cursor: 'pointer' }}>
          Cantidad Disponible {orden.cantidadDisponible === 'asc' ? '↑' : orden.cantidadDisponible === 'desc' ? '↓' : ''}
        </th>
        <th onClick={() => handleOrdenar('precioCompra')} style={{ cursor: 'pointer' }}>
          Precio de Compra {orden.precioCompra === 'asc' ? '↑' : orden.precioCompra === 'desc' ? '↓' : ''}
        </th>
        <th onClick={() => handleOrdenar('precioVenta')} style={{ cursor: 'pointer' }}>
          Precio de Venta {orden.precioVenta === 'asc' ? '↑' : orden.precioVenta === 'desc' ? '↓' : ''}
        </th>
        <th onClick={() => handleOrdenar('historico')} style={{ cursor: 'pointer' }}>
          Histórico {orden.historico === 'asc' ? '↑' : orden.historico === 'desc' ? '↓' : ''}
        </th>
        <th onClick={() => handleOrdenar('diasMercado')} style={{ cursor: 'pointer' }}>
          Tiempo en Mercado {orden.diasMercado === 'asc' ? '↑' : orden.diasMercado === 'desc' ? '↓' : ''}
        </th>
        <th onClick={() => handleOrdenar('demanda')} style={{ cursor: 'pointer' }}>
          Demanda {orden.demanda === 'asc' ? '↑' : orden.demanda === 'desc' ? '↓' : ''}
        </th>
      </tr>
    </thead>
  );
};

export default FiltroProductos;
