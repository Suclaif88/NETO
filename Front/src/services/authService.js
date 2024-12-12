import axios from 'axios';

const API_URL = 'https://localhost:7170/api/Auth';

export const register = async ({ nombre, apellido, correo, telefono, pass }) => {
  const response = await axios.post(`${API_URL}/register`, {
    nombre,
    apellido,
    correo,
    telefono,
    pass,
  });
  return response.data;
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      correo: email,
      pass: password,
    });

    return response.data;
  } catch (error) {
    throw new Error('Error al iniciar sesión. Verifica tus credenciales.');
  }
};
