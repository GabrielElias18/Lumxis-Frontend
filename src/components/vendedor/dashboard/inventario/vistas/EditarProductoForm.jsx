import React, { useState, useEffect } from "react";
import { X, Pencil } from "lucide-react";
import Swal from "sweetalert2";
import { updateProduct } from "../../../../../services/productServices";
import { getCategoriesByUser } from "../../../../../services/categoryServices";
import './styles/EditarProductoForm.css';

const formatCOP = (val) =>
  val
    ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(val)
    : null;

function EditarProductoForm({ producto, onClose, onUpdate, isInline = false }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidadDisponible, setCantidadDisponible] = useState(0);
  const [precioCompra, setPrecioCompra] = useState(0);
  const [precioVenta, setPrecioVenta] = useState(0);
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [preview, setPreview] = useState([]);
  const [cargando, setCargando] = useState(false);

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
        const data = await getCategoriesByUser(token);
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      preview.forEach((url) => { if (url.startsWith('blob:')) URL.revokeObjectURL(url); });
    };
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const categoriaSeleccionada = categorias.find(cat => String(cat.categoriaid) === String(categoriaId));
      if (!categoriaSeleccionada) throw new Error("Por favor selecciona una categoría válida");

      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("cantidadDisponible", Number(cantidadDisponible));
      formData.append("precioCompra", Number(precioCompra));
      formData.append("precioVenta", Number(precioVenta));
      formData.append("categoriaid", Number(categoriaId));
      formData.append("categoria_nombre", categoriaSeleccionada.nombre);
      imagenes.forEach((img) => formData.append("imagenes", img));

      const response = await updateProduct(producto.productoid, formData, token);
      if (!response) throw new Error("No se recibió respuesta del servidor.");

      onUpdate(response.producto || response);
      onClose();
      Swal.fire({ icon: "success", title: "¡Producto actualizado!", text: "Los cambios se guardaron correctamente.", timer: 1800, showConfirmButton: false });
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      Swal.fire({ icon: "error", title: "Error", text: error.message || "No se pudo actualizar el producto." });
    } finally {
      setCargando(false);
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setImagenes(files);
    setPreview(files.map((f) => URL.createObjectURL(f)));
  };

  return (
    <div className={isInline ? "" : "overlay"} onClick={isInline ? null : onClose}>
      <div className={isInline ? "inline-form-container" : "popup"} onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <div className="modal-header-left">
            <Pencil size={15} className="modal-header-icon" />
            <h2>{isInline ? "Modificando" : "Editar Producto"}</h2>
          </div>
          {!isInline && (
            <button type="button" className="cerrar" onClick={onClose} aria-label="Cerrar">
              <X size={16} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="edit-form">
          <div className="form-content">

            {/* Left column */}
            <div className="form-left">
              <p className="form-section-title">Información básica</p>

              <div className="form-group">
                <label>Nombre <span className="required">*</span></label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Nombre del producto" />
              </div>

              <div className="form-group">
                <label>Descripción <span className="required">*</span></label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required placeholder="Descripción del producto" />
              </div>

              <div className="form-group">
                <label>Categoría <span className="required">*</span></label>
                <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.categoriaid} value={cat.categoriaid}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Imágenes</label>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                <span className="field-helper">Sube nuevas imágenes para reemplazar las actuales.</span>
              </div>

              {preview.length > 0 && (
                <div className="preview-container">
                  {preview.map((img, i) => (
                    <img key={i} src={img} alt="Vista previa" className="preview-image" />
                  ))}
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="form-right">
              <p className="form-section-title">Stock</p>

              <div className="form-group">
                <label>Cantidad disponible <span className="required">*</span></label>
                <input type="number" value={cantidadDisponible} min="0" onChange={(e) => setCantidadDisponible(e.target.value)} required />
              </div>

              <p className="form-section-title">Precios</p>

              <div className="form-group">
                <label>Precio de compra <span className="required">*</span></label>
                <input
                  type="number"
                  value={precioCompra}
                  min="0"
                  onChange={(e) => setPrecioCompra(parseInt(e.target.value) || 0)}
                  required
                />
                {formatCOP(precioCompra) && <span className="field-preview">{formatCOP(precioCompra)}</span>}
              </div>

              <div className="form-group">
                <label>Precio de venta <span className="required">*</span></label>
                <input
                  type="number"
                  value={precioVenta}
                  min="0"
                  onChange={(e) => setPrecioVenta(parseInt(e.target.value) || 0)}
                  required
                />
                {formatCOP(precioVenta) && <span className="field-preview">{formatCOP(precioVenta)}</span>}
              </div>

              {precioCompra > 0 && precioVenta > 0 && (
                <div className="margen-card">
                  <span className="margen-label">Margen</span>
                  <span className="margen-valor">
                    {(((precioVenta - precioCompra) / precioCompra) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="button-group">
            <button type="button" className="atras-btn" onClick={onClose} disabled={cargando}>
              Cancelar
            </button>
            <button type="submit" className="guardar-btn" disabled={cargando}>
              {cargando ? <><span className="btn-spinner" />Guardando...</> : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarProductoForm;
