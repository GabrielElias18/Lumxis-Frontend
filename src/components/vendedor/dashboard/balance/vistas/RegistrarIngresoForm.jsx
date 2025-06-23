import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, DollarSign, Package, AlertCircle } from 'lucide-react';
import Swal from "sweetalert2";
import { getCategoriesByUser } from "../../../../../services/categoryServices";
import { getAllProducts } from "../../../../../services/productServices";
import { createVenta } from "../../../../../services/ventaService";
import "./styles/RegistrarIngresoForm.css";

const RegistrarIngresoForm = ({ cerrarFormulario }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [categoriasConProductos, setCategoriasConProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        const categoriasData = await getCategoriesByUser(token);
        const productosData = await getAllProducts(token);
  
        if (!Array.isArray(categoriasData) || !Array.isArray(productosData)) {
          console.error("Los datos de la API no son un array");
          return;
        }
  
        // Crear un mapa indexado por categoriaid
        const categoriasMap = categoriasData.reduce((acc, categoria) => {
          acc[categoria.categoriaid] = { ...categoria, productos: [] };
          return acc;
        }, {});
  
        // Asignar productos a su categoría correspondiente usando categoriaid
        productosData.forEach((producto) => {
          if (categoriasMap[producto.categoriaid]) {
            categoriasMap[producto.categoriaid].productos.push(producto);
          }
        });
  
        setCategoriasConProductos(Object.values(categoriasMap));
      } catch (error) {
        console.error("Error al cargar datos:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al cargar los datos",
          confirmButtonColor: "#3085d6",
        });
      }
    };
  
    cargarDatos();
  }, []);
  

  const productoIdSeleccionado = watch("productoId");

  useEffect(() => {
    if (productoIdSeleccionado && categoriasConProductos.length > 0) {
      const productoEncontrado = categoriasConProductos
        .flatMap((cat) => cat.productos)
        .find((prod) => String(prod.productoid) === String(productoIdSeleccionado));
  
      setProductoSeleccionado(productoEncontrado || null);
    }
  }, [productoIdSeleccionado, categoriasConProductos]);

  const formatoCOP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  

  const onSubmit = async (data) => {
    try {
      setCargando(true);
      const token = localStorage.getItem("token");

      if (!productoSeleccionado) {
        throw new Error("Producto no encontrado");
      }

      if (productoSeleccionado.cantidadDisponible < data.cantidad) {
        await Swal.fire({
          icon: "error",
          title: "Stock Insuficiente",
          text: `Solo hay ${productoSeleccionado.cantidadDisponible} unidades disponibles de ${productoSeleccionado.nombre}`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Entendido",
        });
        return;
      }

      const ventaData = {
        productoid: productoIdSeleccionado.productoId,
        productoNombre: productoSeleccionado.nombre,
        cantidad: Number(data.cantidad),
        descripcion: data.descripcion || "",
      };

      await createVenta(ventaData, token);

      const total = productoSeleccionado.precioVenta * data.cantidad;

      // Formatear precios sin decimales
      const formatoCOP = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

      await Swal.fire({
        icon: "success",
        title: "¡Venta Exitosa!",
        html: `
          <div class="venta-resumen">
            <p><strong>${data.cantidad}</strong> unidades de <strong>${productoSeleccionado.nombre}</strong></p>
            <p>Precio de venta: ${formatoCOP.format(productoSeleccionado.precioVenta)}</p>
            <p class="total">Total: ${formatoCOP.format(total)}</p>
          </div>
        `,

        showConfirmButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3085d6",
        timer: 3000,
        timerProgressBar: true,
        position: "center",
      }).then(() => {
        window.location.reload();
      });

      reset();
      cerrarFormulario();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error en la Venta",
        text: error.response?.data?.mensaje || "Error al registrar la venta",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Cerrar",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fondo-modal" onClick={cerrarFormulario}>
      <div className="ventana-flotante" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="titulo">Registrar Venta</h2>
          <button className="cerrar-modal" onClick={cerrarFormulario}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="formulario">
          <div className="form-group">
            <label className="label">Producto:</label>
            <select
              {...register("productoId", { required: "El producto es obligatorio" })}
              className="select"
            >
              <option value="">Seleccione un producto</option>
              {categoriasConProductos.map((categoria) => (
                <optgroup key={categoria.categoriaid} label={categoria.nombre}>
                  {categoria.productos.length > 0 ? (
                    categoria.productos.map((producto) => (
                      <option key={producto.productoid} value={producto.productoid}>
                        {producto.nombre} - Stock: {producto.cantidadDisponible}
                      </option>
                    ))
                  ) : (
                    <option disabled>No hay productos</option>
                  )}
                </optgroup>
              ))}
            </select>
            {errors.productoId && (
              <p className="error">
                <AlertCircle size={16} />
                {errors.productoId.message}
              </p>
            )}
          </div>

          {productoSeleccionado && (
            <div className="info-producto">
              <h3>Información del Producto</h3>
              <p>
                <span>Precio de venta:</span>
                <strong>{formatoCOP.format(productoSeleccionado.precioVenta)}</strong>
              </p>
              <p>
                <span>Stock disponible:</span>
                <strong>{productoSeleccionado.cantidadDisponible} unidades</strong>
              </p>
            </div>
          )}


          <div className="form-group">
            <label className="label">Cantidad:</label>
            <input
              type="number"
              {...register("cantidad", {
                required: "Ingrese una cantidad",
                min: { value: 1, message: "La cantidad debe ser mayor a 0" },
              })}
              className="input"
            />
            {errors.cantidad && (
              <p className="error">
                <AlertCircle size={16} />
                {errors.cantidad.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="label">Descripción:</label>
            <textarea
              {...register("descripcion", { required: "La descripción es obligatoria" })}
              className="textarea"
              placeholder="Ingrese una descripción de la venta"
            ></textarea>
            {errors.descripcion && (
              <p className="error">
                <AlertCircle size={16} />
                {errors.descripcion.message}
              </p>
            )}
          </div>

          <div className="botones-formulario">
            <button type="submit" className="boton boton-primario" disabled={cargando}>
              {cargando ? (
                <>
                  <span className="cargando"></span>
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <DollarSign size={18} />
                  <span>Registrar Venta</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarIngresoForm;