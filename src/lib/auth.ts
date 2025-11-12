
// La forma de los datos que los componentes necesitan para el login
interface LoginCredentials {
  email: string;
  password: string;
}

// La forma de la respuesta que el componente espera recibir de esta función
interface LoginResponse {
  token: string;
}

// La forma de la respuesta REAL que la API del backend envía
interface ApiSuccessResponse {
  success: boolean;
  message: string;
  data: {
    user: object; // No necesitamos los detalles del usuario aquí
    token: string;
  };
}

/**
 * Llama a la API de backend, maneja la respuesta anidada y devuelve solo el token.
 * @param credentials - Un objeto con el email y la contraseña del usuario.
 * @returns Un objeto simple que contiene solo el token JWT.
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const requestBody = {
      correo: credentials.email, // Corregido para que coincida con el backend
      password: credentials.password,
    };

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    const apiResponse: ApiSuccessResponse = await response.json();

    // Verificamos que la respuesta del backend tiene la estructura esperada
    if (apiResponse.data && apiResponse.data.token) {
      // Extraemos el token anidado y lo devolvemos en la estructura simple que el componente espera
      return { token: apiResponse.data.token };
    } else {
      // Si el backend responde 200 OK pero no envía el token, es un error inesperado.
      throw new Error('El servidor dio una respuesta exitosa pero no incluyó un token.');
    }

  } catch (error) {
    console.error('Error en la función de login:', error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('Ocurrió un error inesperado durante el inicio de sesión.');
  }
};
