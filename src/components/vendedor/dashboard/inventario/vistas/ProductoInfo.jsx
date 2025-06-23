import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './styles/ProductoInfo.css';
import { deleteProduct, getProductById } from '../../../../../services/productServices';
import { getCategoriesByUser } from '../../../../../services/categoryServices';
import EditarProductoForm from './EditarProductoForm';

function ProductoInfo({ id, onClose }) {
  const [producto, setProducto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          Swal.fire('Error', 'No se encontró el token de autenticación.', 'error');
          return;
        }

        // Obtener el producto
        const productoData = await getProductById(id, token);
        if (!productoData) {
          Swal.fire('Error', 'No se encontró el producto.', 'error');
          onClose();
          return;
        }

        // Obtener las categorías
        const categoriasData = await getCategoriesByUser(token);
        setCategorias(categoriasData);

        // Encontrar el nombre de la categoría correspondiente
        if (productoData.categoriaid && categoriasData.length > 0) {
          const categoriaEncontrada = categoriasData.find(
            cat => String(cat.categoriaid) === String(productoData.categoriaid)
          );
          
          if (categoriaEncontrada) {
            productoData.categoriaNombre = categoriaEncontrada.nombre;
          }
        }

        setProducto(productoData);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        Swal.fire('Error', 'Hubo un problema al cargar la información.', 'error');
        onClose();
      }
    };

    fetchData();
  }, [id, onClose]);

  const handleDelete = async () => {
    const confirmarEliminar = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    });
  
    if (confirmarEliminar.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          Swal.fire('Error', 'No se encontró el token de autenticación.', 'error');
          return;
        }
  
        await deleteProduct(id, token);
        
        Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success').then(() => {
          setTimeout(() => {
            window.location.reload(); // 🔄 Se recarga la página después de eliminar
          }, 500);
        });
  
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
      }
    }
  };

  const handleUpdate = async (updatedProduct) => {
    try {
      // Buscar el nombre de la categoría actualizada
      if (updatedProduct.categoriaid && categorias.length > 0) {
        const categoriaEncontrada = categorias.find(
          cat => String(cat.categoriaid) === String(updatedProduct.categoriaid)
        );
        
        if (categoriaEncontrada) {
          updatedProduct.categoriaNombre = categoriaEncontrada.nombre;
        }
      }
      
      setProducto(updatedProduct);
      setIsEditing(false);
      
      Swal.fire({
        title: 'Producto actualizado',
        text: 'El producto se ha actualizado correctamente.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        setTimeout(() => {
          window.location.reload(); // 🔄 Se recarga con un pequeño retraso
        }, 500);
      });
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      Swal.fire('Error', 'Hubo un problema al actualizar el producto.', 'error');
    }
  };

  if (!producto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditing ? "Editar Producto" : "Detalles del Producto"}</h2>
        <button className="detalle-cerrar" onClick={onClose}>X</button>
  
        {isEditing ? (
          <EditarProductoForm 
            producto={producto} 
            onClose={() => setIsEditing(false)} 
            onUpdate={handleUpdate} 
          />
        ) : (
          <div className="modal-scroll"> {/* <- Aquí se aplica el scroll */}
            <div className="detalle-imagen-container">
              {producto.imagenes?.length > 0 ? (
                <img
                  src={producto.imagenes[0].startsWith("http") ? producto.imagenes[0] : `http://localhost:3000/uploads/${producto.imagenes[0]}`}
                  alt={producto.nombre}
                  className="detalle-imagen"
                  onError={(e) => (e.target.src = "/images/default-product.png")}
                />
              ) : (
                <img src="/images/default-product.png" alt="Sin imagen" className="detalle-imagen" />
              )}
            </div>
  
            <div className="detalle-info">
              <h3 className="detalle-titulo">{producto.nombre}</h3>
              <p><strong>Descripción:</strong> {producto.descripcion}</p>
              <p><strong>Cantidad Disponible:</strong> {producto.cantidadDisponible}</p>
              <p><strong>Precio de Compra:</strong> {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(producto.precioCompra)}</p>
              <p><strong>Precio de Venta:</strong> {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(producto.precioVenta)}</p>
              <p><strong>Categoría:</strong> {producto.categoriaNombre || "Sin categoría"}</p>
            </div>
  
            <div className="detalle-acciones">
              <button className="detalle-editar-btn" onClick={() => setIsEditing(true)}>Editar</button>
              <button className="detalle-eliminar-btn" onClick={handleDelete}>Eliminar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductoInfo;