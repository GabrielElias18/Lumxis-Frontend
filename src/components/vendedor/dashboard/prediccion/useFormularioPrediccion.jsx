import { useState, useEffect } from 'react';
import { getAllProducts } from './../../../../services/productServices';
import { getVentas } from './../../../../services/ventaService';
import { predecirDemanda } from './../../../../services/prediccionService';

export const useFormularioPrediccion = () => {
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState({
    precioVenta: '',
    cantidadDisponible: '',
    historico_ventas: '',
    tiempo_en_mercado: '',
  });
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getAllProducts(token);
        setProductos(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };
    cargarProductos();
  }, []);

  const handleSeleccionProducto = async (e) => {
    const producto = JSON.parse(e.target.value);
    setProductoSeleccionado(producto);
  
    const fechaActual = new Date();
    const fechaIngreso = new Date(producto.createdat);
    const tiempoEnInventario = Math.floor((fechaActual - fechaIngreso) / (1000 * 60 * 60 * 24));
  
    try {
      const token = localStorage.getItem("token");
      const ventas = await getVentas(token);
  
      const ventasProducto = ventas.filter(v => v.productoNombre === producto.nombre);
      const historicoVentas = ventasProducto.reduce((acc, v) => acc + (v.cantidad || 0), 0);
  
      setFormulario((prevFormulario) => ({
        ...prevFormulario,
        precioVenta: producto.precioVenta || '',
        precioCompra: producto.precioCompra || '', // ✅ AÑADIDO
        cantidadDisponible: producto.cantidadDisponible || '',
        tiempo_en_mercado: tiempoEnInventario || '',
        historico_ventas: historicoVentas || '',
        categoria: producto.categoriaNombre || '',       // ✅ AÑADIDO
      }));
    } catch (error) {
      console.error('Error al procesar ventas:', error);
    }
  };
  

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const enviarDatos = async (e) => {
    e.preventDefault();
    try {
      const data = await predecirDemanda(formulario);
      const clasePredicha = Object.entries(data).reduce((max, curr) => curr[1] > max[1] ? curr : max);

      setResultado({
        probabilidades: data,
        clasePredicha: clasePredicha[0],
        porcentaje: clasePredicha[1],
      });
    } catch (error) {
      console.error('Error al predecir:', error);
      setResultado({
        error: error.mensaje || 'Ocurrió un error inesperado al predecir la demanda.',
      });
    }
  };

  return {
    productos,
    formulario,
    resultado,
    handleChange,
    enviarDatos,
    handleSeleccionProducto,
  };
};
