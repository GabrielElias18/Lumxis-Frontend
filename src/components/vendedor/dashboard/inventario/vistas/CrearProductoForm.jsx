import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./styles/CrearProductoForm.css";
import { createProduct } from "../../../../../services/productServices";
import { getCategoriesByUser } from "../../../../../services/categoryServices";

function CrearProductoForm({ isVisible, onClose }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidadDisponible, setCantidadDisponible] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [preview, setPreview] = useState([]); // Para mostrar las imágenes antes de enviarlas
  const [categoriaNombre, setCategoriaNombre] = useState("");
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const categoriasData = await getCategoriesByUser(token);
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  if (!isVisible) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("cantidadDisponible", cantidadDisponible);
      formData.append("precioCompra", precioCompra);
      formData.append("precioVenta", precioVenta);
      formData.append("categoriaNombre", categoriaNombre);

      imagenes.forEach((imagen) => {
        formData.append("imagenes", imagen);
      });

      await createProduct(formData, token);

      Swal.fire({
        title: "¡Éxito!",
        text: "Producto creado satisfactoriamente.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });

      setNombre("");
      setDescripcion("");
      setCantidadDisponible("");
      setPrecioCompra("");
      setPrecioVenta("");
      setImagenes([]);
      setPreview([]);
      setCategoriaNombre("");
      onClose();
    } catch (error) {
      console.error("Error al crear el producto:", error);

      Swal.fire({
        title: "Error",
        text: error.response?.data?.mensaje || "Hubo un problema al crear el producto.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setImagenes(files);

    // Generar vistas previas de las imágenes
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  return (
    <div className="overlay">
      <div className="popup">
        <h2>Crear Nuevo Producto</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="productoNombre">Nombre del Producto</label>
            <input
              type="text"
              id="productoNombre"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="productoDescripcion">Descripción</label>
            <textarea
              id="productoDescripcion"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="productoCantidad">Cantidad Disponible</label>
            <input
              type="number"
              id="productoCantidad"
              placeholder="Cantidad"
              value={cantidadDisponible}
              onChange={(e) => setCantidadDisponible(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="productoPrecioCompra">Precio de Compra</label>
            <input
              type="number"
              id="productoPrecioCompra"
              placeholder="Precio de Compra"
              value={precioCompra}
              onChange={(e) => setPrecioCompra(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="productoPrecioVenta">Precio de Venta</label>
            <input
              type="number"
              id="productoPrecioVenta"
              placeholder="Precio de Venta"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="productoCategoria">Seleccionar Categoría</label>
            <select
              id="productoCategoria"
              value={categoriaNombre}
              onChange={(e) => setCategoriaNombre(e.target.value)}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.categoriaId} value={categoria.nombre}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="productoImagenes">Imágenes</label>
            <input
              type="file"
              id="productoImagenes"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          {/* Vista previa de imágenes seleccionadas */}
          {preview.length > 0 && (
            <div className="preview-container">
              {preview.map((img, index) => (
                <img key={index} src={img} alt="Vista previa" className="preview-image" />
              ))}
            </div>
          )}
          <div className="form-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearProductoForm;
