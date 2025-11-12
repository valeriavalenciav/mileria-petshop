
// Definimos la forma de los datos que necesitamos para el login
interface LoginCredentials {
  email: string;
  password: string;
}

// Definimos la forma de la respuesta que esperamos del backend
interface LoginResponse {
  token: string;
  // Puedes añadir más campos si tu backend los devuelve, como el nombre de usuario, etc.
}

/**
 * Llama a la API de backend para autenticar al usuario.
 * @param credentials - Un objeto con el email y la contraseña del usuario.
 * @returns La respuesta del servidor, que debería incluir un token JWT.
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    // Preparamos el cuerpo de la petición con el nombre de campo esperado por el backend: "correo".
    const requestBody = {
      correo: credentials.email,
      password: credentials.password,
    };

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody), // Usamos el cuerpo corregido
    });

    if (!response.ok) {
      // Si la respuesta no es 2xx, intentamos leer el mensaje de error del backend
      const errorData = await response.json();
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    return data;

  } catch (error) {
    console.error('Error en la función de login:', error);
    // Re-lanzamos el error para que el componente que llama pueda manejarlo.
    // Esto es importante para mostrar mensajes de error al usuario.
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('Ocurrió un error inesperado durante el inicio de sesión.');
  }
};
