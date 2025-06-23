import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { updateProduct } from "../../../../../services/productServices";
import { getCategoriesByUser } from "../../../../../services/categoryServices";
import './styles/EditarProductoForm.css';

function EditarProductoForm({ producto, onClose, onUpdate }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidadDisponible, setCantidadDisponible] = useState(0);
  const [precioCompra, setPrecioCompra] = useState(0);
  const [precioVenta, setPrecioVenta] = useState(0);
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre || "");
      setDescripcion(producto.descripcion || "");
      setCantidadDisponible(producto.cantidadDisponible || 0);
      setPrecioCompra(producto.precioCompra || 0);
      setPrecioVenta(producto.precioVenta || 0);
      setCategoriaId(producto.categoriaid || "");
      setPreview(producto.imagenes || []);
    }
  }, [producto]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token no encontrado");
        const categoriasData = await getCategoriesByUser(token);
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");
  
      // Encontrar la categoría seleccionada
      const categoriaSeleccionada = categorias.find(cat => String(cat.categoriaid) === String(categoriaId));
      const categoriaNombre = categoriaSeleccionada ? categoriaSeleccionada.nombre : "";
      
      // Verificar que tengamos una categoría válida
      if (!categoriaSeleccionada) {
        throw new Error("Por favor selecciona una categoría válida");
      }
  
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("cantidadDisponible", Number(cantidadDisponible));
      formData.append("precioCompra", Number(precioCompra));
      formData.append("precioVenta", Number(precioVenta));
      formData.append("categoriaid", Number(categoriaId));
      formData.append("categoria_nombre", categoriaNombre);
  
      imagenes.forEach((imagen) => {
        formData.append("imagenes", imagen);
      });
  
      console.log("🚀 Datos enviados al backend:", Object.fromEntries(formData.entries()));
  
      const updatedProduct = await updateProduct(producto.productoid, formData, token);
  
      if (!updatedProduct) {
        throw new Error("No se recibió respuesta del servidor.");
      }
  
      onUpdate(updatedProduct);
      onClose();
  
      Swal.fire({
        icon: "success",
        title: "¡Producto actualizado!",
        text: "El producto se ha actualizado correctamente.",
      });
  
    } catch (error) {
      console.error("❌ Error al actualizar el producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el producto.",
      });
    }
  };
  

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setImagenes(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  useEffect(() => {
    return () => {
      preview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview]);

  return (
    <div className="overlay">
      <div className="popup">
        <h2>Editar Producto</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Cantidad Disponible:</label>
            <input type="number" value={cantidadDisponible} onChange={(e) => setCantidadDisponible(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Precio de Compra:</label>
            <input
              type="number"
              value={precioCompra}
              onChange={(e) => setPrecioCompra(parseInt(e.target.value) || 0)}
              required
            />
            <small>
              {precioCompra
                ? `Vista previa: ${new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(precioCompra)}`
                : ''}
            </small>
          </div>

          <div className="form-group">
            <label>Precio de Venta:</label>
            <input
              type="number"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(parseInt(e.target.value) || 0)}
              required
            />
            <small>
              {precioVenta
                ? `Vista previa: ${new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(precioVenta)}`
                : ''}
            </small>
          </div>

          <div className="form-group">
            <label>Seleccionar Categoría:</label>
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.categoriaid} value={categoria.categoriaid}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Imágenes:</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          </div>
          {preview.length > 0 && (
            <div className="preview-container">
              {preview.map((img, index) => (
                <img key={index} src={img} alt="Vista previa" className="preview-image" />
              ))}
            </div>
          )}
          <button type="submit" className="guardar-btn">Guardar Cambios</button>
          <button type="submit" className="guardar-btn" onClick={onClose}>Atras</button>
        </form>
      </div>
    </div>
  );
}

export default EditarProductoForm;
