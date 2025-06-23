import React, { useState } from 'react';
import ProductoInfo from './ProductoInfo';
import './styles/VisualizarProductos.css';

function VisualizarProductos({ productos }) {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductoClick = (id) => {
    setSelectedProductId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  if (!productos || productos.length === 0) {
    return <p className="sin-productos">No hay productos disponibles.</p>;
  }

  return (
    <div className="productos-container">
      {productos.map((producto) => (
        <div 
          key={producto.productoid} 
          className="producto-card" 
          onClick={() => handleProductoClick(producto.productoid)} // Abre el modal al hacer clic
        >
          <div className="producto-imagen-container">
            {producto.imagenes && producto.imagenes.length > 0 ? (
              <img
                src={producto.imagenes[0].startsWith("http") ? producto.imagenes[0] : `http://localhost:3000/uploads/${producto.imagenes[0]}`}
                alt={producto.nombre}
                className="producto-imagen"
                onError={(e) => (e.target.src = "/images/default-product.png")}
              />
            ) : (
              <img
                src="/images/default-product.png"
                alt="Sin imagen"
                className="producto-imagen"
              />
            )}
          </div>
          <h3 className="producto-nombre">{producto.nombre}</h3>
          <p className="producto-cantidad">Cantidad Disponible: {producto.cantidadDisponible}</p>
        </div>
      ))}

      {/* Modal nativo */}
      {isModalOpen && selectedProductId && (
        <ProductoInfo id={selectedProductId} onClose={closeModal} />
      )}
    </div>
  );
}

export default VisualizarProductos;
