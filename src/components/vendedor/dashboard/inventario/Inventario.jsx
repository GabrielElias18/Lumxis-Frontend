import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Plus, FolderPlus, Settings } from 'lucide-react';
import VisualizarProductos from './vistas/VisualizarProductos';
import CrearCategoriaForm from './vistas/CrearCategoriaForm';
import CrearProductoForm from './vistas/CrearProductoForm';
import GestionarCategoriaForm from './vistas/GestionarCategoriaForm';
import ProductoInfo from './vistas/ProductoInfo';
import { getCategoriesByUser } from '../../../../services/categoryServices';
import { getAllProducts } from '../../../../services/productServices';
import './Inventario.css';

function Inventario() {
  const [isCrearCategoriaVisible, setCrearCategoriaVisible] = useState(false);
  const [isCrearProductoVisible, setCrearProductoVisible] = useState(false);
  const [isGestionarCategoriaVisible, setGestionarCategoriaVisible] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productosPorPagina = 10;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const categoriasData = await getCategoriesByUser(token);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategoriaId]);

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const productosData = await getAllProducts(token);
        if (Array.isArray(productosData)) {
          setProductos(productosData);
        } else {
          console.error("La respuesta no contiene un array válido.");
          setProductos([]);
        }
      } else {
        console.error("No se encontró el token.");
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      setProductos([]);
    }
  };

  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria = selectedCategoriaId
      ? String(producto.categoriaid) === String(selectedCategoriaId)
      : true;

    const coincideNombre = searchTerm
      ? producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return coincideCategoria && coincideNombre;
  });

  const indexUltimo = currentPage * productosPorPagina;
  const indexPrimero = indexUltimo - productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const mostrarRangoPaginas = (paginaActual, totalPaginas, paginasVisibles = 5) => {
    const rangoInicio = Math.max(1, paginaActual - Math.floor(paginasVisibles / 2));
    const rangoFin = Math.min(totalPaginas, rangoInicio + paginasVisibles - 1);

    const paginas = [];
    for (let i = rangoInicio; i <= rangoFin; i++) {
      paginas.push(i);
    }

    return paginas;
  };

  const paginasAMostrar = mostrarRangoPaginas(currentPage, totalPaginas);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setCurrentPage(nuevaPagina);
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto.productoid === updatedProduct.productoid ? updatedProduct : producto
        )
      );

      await Swal.fire({
        icon: 'success',
        title: '¡Producto actualizado!',
        text: 'El producto se ha actualizado correctamente.',
      });

      fetchProductos();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el producto.',
      });
    }
  };

  const handleDeleteProduct = async (deletedProductId) => {
    try {
      setProductos((prevProductos) =>
        prevProductos.filter((producto) => producto.productoid !== deletedProductId)
      );
      await Swal.fire({
        icon: 'success',
        title: '¡Producto eliminado!',
        text: 'El producto se ha eliminado correctamente.',
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el producto.',
      });
    }
  };

  return (
    <div className="inventario-main">
      <div className="inventario-top">
        <div className="inventario-buttons-left">
          <button 
            className="inventario-btn inventario-btn-primary"
            onClick={() => setCrearProductoVisible(true)}
          >
            <Plus size={18} />
            <span>Agregar Producto</span>
          </button>
          <button 
            className="inventario-btn inventario-btn-secondary"
            onClick={() => setCrearCategoriaVisible(true)}
          >
            <FolderPlus size={18} />
            <span>Agregar Categoría</span>
          </button>
        </div>

        <div className="inventario-filters-right">
          <button 
            className="inventario-btn inventario-btn-secondary"
            onClick={() => setGestionarCategoriaVisible(true)}
          >
            <Settings size={18} />
            <span>Gestionar Categorías</span>
          </button>
          <select
            className="inventario-select"
            value={selectedCategoriaId}
            onChange={(e) => setSelectedCategoriaId(e.target.value)}
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.categoriaid} value={categoria.categoriaid}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="inventario-search-sticky">
        <input
          type="text"
          className="inventario-search-input"
          placeholder="Buscar Producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="inventario-products">
        <VisualizarProductos
          productos={productosPaginados}
          onVerDetalles={setProductoSeleccionado}
        />
      </div>

      {totalPaginas > 1 && (
        <div className="paginacion">
          <button 
            className="paginacion-btn"
            onClick={() => cambiarPagina(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>

          {paginasAMostrar.map((pagina) => (
            <button
              key={pagina}
              className={`paginacion-btn ${currentPage === pagina ? 'activo' : ''}`}
              onClick={() => cambiarPagina(pagina)}
            >
              {pagina}
            </button>
          ))}

          <button 
            className="paginacion-btn"
            onClick={() => cambiarPagina(currentPage + 1)}
            disabled={currentPage === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      )}

      {productoSeleccionado && (
        <ProductoInfo
          id={productoSeleccionado.productoid}
          onClose={() => {
            setProductoSeleccionado(null);
            fetchProductos();
          }}
        />
      )}

      <CrearCategoriaForm
        isVisible={isCrearCategoriaVisible}
        onClose={() => {
          setCrearCategoriaVisible(false);
          fetchProductos();
        }}
      />
      <CrearProductoForm
        isVisible={isCrearProductoVisible}
        onClose={() => {
          setCrearProductoVisible(false);
          fetchProductos();
        }}
      />
      <GestionarCategoriaForm
        isVisible={isGestionarCategoriaVisible}
        onClose={() => {
          setGestionarCategoriaVisible(false);
          fetchProductos();
        }}
      />
    </div>
  );
}

export default Inventario;
