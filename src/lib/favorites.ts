
import Cookies from 'js-cookie';

// Define la estructura de un producto favorito según tu especificación
interface ProductoFavorito {
  productoId: string;
  nombre: string;
  precio: number;
}

const backendUrl = 'https://mileria-backend.vercel.app';

const handleUnauthorized = (response: Response) => {
  if (response.status === 401 && typeof window !== 'undefined') {
    // Borra el token posiblemente inválido
    Cookies.remove('token');
    // Redirige al login
    window.location.href = '/login';
    return true;
  }
  return false;
};

/**
 * Obtiene los productos favoritos de un usuario desde el backend.
 * @param userId - El ID del usuario.
 * @returns Una promesa que resuelve a un array de productos favoritos.
 */
export const getFavorites = async (userId: string): Promise<any[]> => {
  const token = Cookies.get('token');
  if (!token) return Promise.resolve([]); // Si no hay token, no hay favoritos

  const response = await fetch(`${backendUrl}/api/users/${userId}/favoritos`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (handleUnauthorized(response)) {
    return []; // Retorna un array vacío durante la redirección
  }

  if (!response.ok) {
    throw new Error('No se pudieron obtener los favoritos.');
  }

  const data = await response.json();
  return data.favoritos || []; // El backend devuelve un objeto { success: true, favoritos: [...] }
};

/**
 * Agrega un producto a los favoritos de un usuario.
 * @param userId - El ID del usuario.
 * @param product - El producto a agregar, debe incluir productoId, nombre y precio.
 * @returns Una promesa que resuelve con los datos de la respuesta.
 */
export const addFavorite = async (userId: string, product: ProductoFavorito): Promise<any> => {
  const token = Cookies.get('token');
  if (!token) throw new Error('Usuario no autenticado');

  const response = await fetch(`${backendUrl}/api/users/${userId}/favoritos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (handleUnauthorized(response)) {
    return; // No retornar nada durante la redirección
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'El backend respondió con un error no-JSON.' }));
    console.error('Error del backend al añadir favorito:', errorData);
    throw new Error(errorData.message || 'No se pudo agregar el favorito.');
  }

  return response.json();
};

/**
 * Elimina un producto de los favoritos de un usuario.
 * @param userId - El ID del usuario.
 * @param productId - El ID del producto a eliminar.
 * @returns Una promesa que resuelve cuando la operación es exitosa.
 */
export const removeFavorite = async (userId: string, productId: string): Promise<void> => {
  const token = Cookies.get('token');
  if (!token) throw new Error('Usuario no autenticado');

  const response = await fetch(`${backendUrl}/api/users/${userId}/favoritos/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (handleUnauthorized(response)) {
    return; // No hacer nada más durante la redirección
  }
  
  if (!response.ok && response.status !== 204) {
    const errorData = await response.json().catch(() => ({ message: 'El backend respondió con un error no-JSON.' }));
    console.error('Error del backend al eliminar favorito:', errorData);
    throw new Error(errorData.message || 'No se pudo eliminar el favorito.');
  }
};
