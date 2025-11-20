// src/services/authServices.js
import axios from 'axios';

const API_URL = 'https://ordereasy-backend-533n.onrender.com/api/auth';

// Función para manejar el login
const loginUser = async (correo, contraseña) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      correo,
      contraseña,
    });
    return response.data; // Devolver la respuesta con el token
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.mensaje); // Manejar el mensaje de error del backend
    } else {
      throw new Error('Error al conectar con el servidor.');
    }
  }
};

// Función para manejar el registro
const registerUser = async (usuarioData) => {
  try {
    const response = await axios.post(`${API_URL}/register-public`, usuarioData);
    return response.data; // Devolver la respuesta con el token y usuario
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.mensaje);
    } else {
      throw new Error('Error al conectar con el servidor.');
    }
  }
};

export { loginUser, registerUser };
