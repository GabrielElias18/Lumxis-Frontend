import axiosInstance from '../api/axiosConfig';

export const createCliente = async (cliente, token) => {
  try {
    const response = await axiosInstance.post('/api/clientes', cliente, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al registrar el cliente.' };
  }
};

export const getClientes = async (token) => {
  try {
    const response = await axiosInstance.get('/api/clientes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.clientes || response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al obtener los clientes.' };
  }
};

export const updateCliente = async (id, cliente, token) => {
  try {
    const response = await axiosInstance.patch(`/api/clientes/${id}`, cliente, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al actualizar el cliente.' };
  }
};

export const deleteCliente = async (id, token) => {
  try {
    const response = await axiosInstance.delete(`/api/clientes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al eliminar el cliente.' };
  }
};
