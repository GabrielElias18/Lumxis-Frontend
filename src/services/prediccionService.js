// services/prediccionService.js
import axios from 'axios';

export const predecirDemanda = async (datos) => {
  try {
    const response = await axios.post('http://localhost:8001/api/predecir', {
      precio_venta: parseFloat(datos.precioVenta),
      precio_compra: parseFloat(datos.precioCompra),
      cantidad_disponible: parseFloat(datos.cantidadDisponible),
      historico_ventas: parseFloat(datos.historico_ventas),
      tiempo_en_mercado: parseFloat(datos.tiempo_en_mercado),
      categoria: datos.categoria
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      mensaje: 'No se pudo predecir la demanda.',
    };
  }
};
