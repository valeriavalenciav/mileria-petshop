
import Cookies from 'js-cookie';
import { type GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

// Define la estructura de un producto favorito según tu especificación
interface ProductoFavorito {
  productoId: string;
  nombre: string;
  precio: number;
}

const backendUrl = 'https://mileria-backend.vercel.app';

// Helper unificado para obtener el token
const getToken = (ctx?: GetServerSidePropsContext): string | undefined => {
  if (ctx) {
    // Lado del servidor: Usar nookies para parsear las cookies del contexto de la solicitud
    const cookies = nookies.get(ctx);
    return cookies.token;
  } else {
    // Lado del cliente: Usar js-cookie para leer la cookie del navegador
    return Cookies.get('token');
  }
};

// Helper para manejar respuestas no autorizadas y redirigir si es necesario
const handleUnauthorized = (response: Response) => {
  if (response.status === 401 && typeof window !== 'undefined') {
    // Solo redirigir en el lado del cliente
    Cookies.remove('token');
    window.location.href = '/login';
    return true;
  }
  return false;
};

/**
 * Obtiene los productos favoritos de un usuario.
 * Funciona tanto en el lado del cliente como en el del servidor (isomórfico).
 * @param userId - El ID del usuario.
 * @param ctx - (Opcional) El contexto de getServerSideProps para ejecuciones en el servidor.
 * @returns Una promesa que resuelve a un array de objetos de favoritos desde tu backend.
 */
export const getFavorites = async (userId: string, ctx?: GetServerSidePropsContext): Promise<any[]> => {
  const token = getToken(ctx);
  if (!token) {
    // Si no hay token, no podemos hacer nada, devolvemos una lista vacía.
    return Promise.resolve([]);
  }

  const response = await fetch(`${backendUrl}/api/users/${userId}/favoritos`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (handleUnauthorized(response)) {
    return [];
  }

  // Un 404 es un caso esperado: el usuario existe pero no tiene favoritos.
  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Error al obtener favoritos:', errorBody);
    throw new Error('No se pudieron obtener los favoritos.');
  }

  const apiResponse = await response.json();
  // Devolvemos el array `data` que contiene la lista de favoritos
  return apiResponse.data || [];
};

/**
 * Agrega un producto a los favoritos de un usuario (solo se usa en el cliente).
 */
export const addFavorite = async (userId: string, product: ProductoFavorito): Promise<any> => {
  const token = getToken();
  if (!token) throw new Error('Usuario no autenticado para agregar favorito.');

  const response = await fetch(`${backendUrl}/api/users/${userId}/favoritos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (handleUnauthorized(response)) {
    return;
  }

  if (!response.ok) {
    const errorBody = await response.text();
    // Lanzar un error más descriptivo ayuda a la depuración en el frontend
    throw new Error(`Error al agregar favorito: ${response.status} - ${errorBody}`);
  }

  return response.json();
};

/**
 * Elimina un producto de los favoritos de un usuario (solo se usa en el cliente).
 */
export const removeFavorite = async (userId: string, productId: string): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error('Usuario no autenticado para eliminar favorito.');

  const response = await fetch(`${backendUrl}/api/users/${userId}/favoritos/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (handleUnauthorized(response)) {
    return;
  }

  // El backend podría devolver 204 No Content, que es un éxito.
  if (!response.ok && response.status !== 204) {
    const errorBody = await response.text();
    throw new Error(`Error al eliminar favorito: ${response.status} - ${errorBody}`);
  }
};
