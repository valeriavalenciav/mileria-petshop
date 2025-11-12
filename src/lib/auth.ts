
// --- INTERFACES COMUNES ---

// La respuesta que los componentes esperan de las funciones de autenticación
interface AuthResponse {
  token: string;
}

// La forma de la respuesta REAL que la API del backend envía en caso de éxito
interface ApiAuthSuccessResponse {
  success: boolean;
  message: string;
  data: {
    user: object;
    token: string;
  };
}

// --- LOGIN ---

// Credenciales para el inicio de sesión
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Llama a la API de login, maneja la respuesta anidada y devuelve solo el token.
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: credentials.email, password: credentials.password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    const apiResponse: ApiAuthSuccessResponse = await response.json();

    if (apiResponse.data && apiResponse.data.token) {
      return { token: apiResponse.data.token };
    } else {
      throw new Error('El servidor dio una respuesta exitosa pero no incluyó un token.');
    }
  } catch (error) {
    console.error('Error en la función de login:', error);
    if (error instanceof Error) throw error;
    throw new Error('Ocurrió un error inesperado durante el inicio de sesión.');
  }
};


// --- REGISTRO ---

// Credenciales para el registro de un nuevo usuario
export interface RegisterCredentials {
    nombre: string;
    correo: string;
    password: string;
    direccion: string;
}

/**
 * Llama a la API de registro, maneja la respuesta anidada y devuelve el token.
 */
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    // El endpoint de registro, asumimos que es /api/auth/register
    // Necesitaremos añadir un rewrite para esto en next.config.js
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // El backend puede enviar errores en un array o como un solo mensaje
      const message = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message;
      throw new Error(message || `Error del servidor: ${response.status}`);
    }

    const apiResponse: ApiAuthSuccessResponse = await response.json();

    if (apiResponse.data && apiResponse.data.token) {
      return { token: apiResponse.data.token };
    } else {
      throw new Error('El servidor dio una respuesta de registro exitosa pero no incluyó un token.');
    }

  } catch (error) {
    console.error('Error en la función de registro:', error);
    if (error instanceof Error) throw error;
    throw new Error('Ocurrió un error inesperado durante el registro.');
  }
};
