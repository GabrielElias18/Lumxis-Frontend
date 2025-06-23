import axios from 'axios';

const API_URL = 'http://localhost:3000/api/ventas';

// Crear una venta
export const createVenta = async (venta, token) => {
  try {
    const response = await axios.post(
      API_URL,
      venta,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al registrar la venta.' };
  }
};

// Obtener todas las ventas del usuario
export const getVentas = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al obtener las ventas.' };
  }
};

// Actualizar una venta
export const updateVenta = async (id, venta, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, venta, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al actualizar la venta.' };
  }
};

// Eliminar una venta
export const deleteVenta = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al eliminar la venta.' };
  }
};