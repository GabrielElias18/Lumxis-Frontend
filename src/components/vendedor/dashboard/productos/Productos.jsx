// ...otros imports
import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../../../../services/productServices';
import { getVentas } from '../../../../services/ventaService';
import { predecirDemanda } from '../../../../services/prediccionService';
import FiltroProductos from './FiltroProductos';
import { exportarProductosPorPaginas } from './exportarExcel';
import './Productos.css';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 20;
  const [paginasAExportar, setPaginasAExportar] = useState(1);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');

  const [orden, setOrden] = useState({
    fecha: 'none',
    nombre: 'none',
    precioCompra: 'none',
    precioVenta: 'none',
    cantidadDisponible: 'none',
    diasMercado: 'none',
    categoriaNombre: 'none',
    demanda: 'none',
    historico: 'none',
  });

  const [demandaPorProducto, setDemandaPorProducto] = useState({});

  useEffect(() => {
    const fetchProductos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const productosData = await getAllProducts(token);
        const ventas = await getVentas(token);

        const ventasPorProducto = productosData.reduce((acc, producto) => {
          const ventasFiltradas = ventas.filter(
            (venta) =>
              venta.productoNombre?.toLowerCase() === producto.nombre?.toLowerCase()
          );
          const totalVentas = ventasFiltradas.reduce((acc, venta) => acc + venta.cantidad, 0);
          acc[producto.productoid] = totalVentas;
          return acc;
        }, {});

        const productosConHistorico = productosData.map((producto) => ({
          ...producto,
          historico: ventasPorProducto[producto.productoid] || 0,
        }));

        setProductos(productosConHistorico);

        const predicciones = await Promise.all(
          productosConHistorico.map(async (producto) => {
            const datos = {
              precioVenta: producto.precioVenta,
              precioCompra: producto.precioCompra,
              cantidadDisponible: producto.cantidadDisponible,
              historico_ventas: producto.historico,
              tiempo_en_mercado: calcularDiasEnMercado(producto.createdat),
              categoria: producto.categoriaNombre,
            };

            try {
              const prediccion = await predecirDemanda(datos);
              const [categoriaMayor] = Object.entries(prediccion).reduce((a, b) =>
                a[1] > b[1] ? a : b
              );
              return { id: producto.productoid, categoria: categoriaMayor };
            } catch (e) {
              console.error(`Error al predecir demanda del producto ${producto.nombre}:`, e);
              return { id: producto.productoid, categoria: 'Error' };
            }
          })
        );

        const resultados = predicciones.reduce((acc, { id, categoria }) => {
          acc[id] = categoria;
          return acc;
        }, {});

        setDemandaPorProducto(resultados);
      } catch (error) {
        console.error('Error al obtener productos o ventas:', error);
      }
    };

    fetchProductos();
  }, []);

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

  const categoriasUnicas = ['Todas', ...new Set(productos.map(p => p.categoriaNombre).filter(Boolean))];

  const productosFiltrados = productos.filter((producto) => {
    const coincideNombre = producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    const coincideCategoria = categoriaFiltro === 'Todas' || producto.categoriaNombre === categoriaFiltro;
    return coincideNombre && coincideCategoria;
  });

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  return (
    <div className="tabla-container">
      <h3>Productos</h3>
      <div className="filters-container">
        <div>
          <label htmlFor="buscar">Buscar:</label>
          <input
            id="buscar"
            type="text"
            placeholder="por nombre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPaginaActual(1);
            }}
            className="filter-input"
          />
        </div>

        <div>
          <label htmlFor="selectCategoria">Categorías:</label>
          <select
            className="select-style"
            id="selectCategoria"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            {categoriasUnicas.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="selectPaginas">Páginas a exportar:</label>
          <select
            className="select-style"
            id="selectPaginas"
            value={paginasAExportar}
            onChange={(e) => setPaginasAExportar(Number(e.target.value))}
          >
            {Array.from({ length: totalPaginas }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            const productosParaExportar = productosFiltrados.slice(0, paginasAExportar * productosPorPagina);
            exportarProductosPorPaginas(productosParaExportar, demandaPorProducto);
          }}
          className="btn-exportar"
        >
          Exportar Excel
        </button>
      </div>



      <table className="tabla-productos">
        <FiltroProductos
          productosFiltrados={productosFiltrados}
          setProductos={setProductos}
          orden={orden}
          setOrden={setOrden}
          demandaPorProducto={demandaPorProducto}
        />
        <tbody>
          {productosPaginados.length > 0 ? (
            productosPaginados.map((producto) => (
              <tr key={producto.productoid}>
                <td>{formatFecha(producto.createdat)}</td>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.categoriaNombre}</td>
                <td>{producto.cantidadDisponible}</td>
                <td>${Number(producto.precioCompra).toLocaleString('es-CO')}</td>
                <td>${Number(producto.precioVenta).toLocaleString('es-CO')}</td>
                <td>{producto.historico}</td>
                <td>{calcularDiasEnMercado(producto.createdat)} días</td>
                <td>{capitalizarDemanda(demandaPorProducto[producto.productoid] || 'Cargando...')}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No hay productos disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="paginacion">
        <button
          onClick={() => setPaginaActual(paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          Anterior
        </button>
        <span>
          Página {paginaActual} de {totalPaginas}
        </span>
        <button
          onClick={() => setPaginaActual(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Productos;
