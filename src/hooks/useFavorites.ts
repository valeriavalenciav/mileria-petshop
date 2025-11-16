
import useSWR from 'swr';
import { useUser } from '@src/hooks/useUser';
import { getFavorites, addFavorite, removeFavorite } from '@src/lib/favorites';

// El fetcher para SWR usará nuestra función getFavorites.
// La clave SWR (`key`) ahora es un array que contiene el nombre y el userId.
const favoritesFetcher = async ([_key, userId]: [string, string]) => {
    if (!userId) {
      return []; // No buscar si no hay userId.
    }
    // Llamamos a getFavorites solo con el userId.
    // La función se encargará de obtener el token del lado del cliente.
    return getFavorites(userId);
};

export const useFavorites = () => {
  const { user } = useUser();
  const userId = user?._id;

  // La clave de SWR ahora incluye el userId. Si userId es nulo, SWR no ejecutará el fetcher.
  const { data: favorites, error, mutate, isLoading } = useSWR(
    userId ? ['favorites', userId] : null, 
    favoritesFetcher, 
    {
      revalidateOnFocus: false, // Evita recargas innecesarias.
    }
  );

  // Optimistic UI Updates: Añadir favorito
  const handleAddFavorite = async (product: any) => {
    if (!userId || !product || !product.name || !product.price) return;

    const tempFavorite = { ...product, isOptimistic: true };

    // Actualiza la UI localmente de forma optimista.
    mutate(currentFavorites => [...(currentFavorites || []), tempFavorite], false);

    try {
      // Llama a la API para añadir el favorito.
      await addFavorite(userId, {
        productoId: product.productId || product.sys.id, // Compatibilidad
        nombre: product.name,
        precio: product.price,
      });
      // Vuelve a validar los datos desde el servidor para obtener la versión final.
      mutate();
    } catch (err) {
      // Si la API falla, revierte la UI al estado anterior.
      console.error(err);
      mutate(currentFavorites => currentFavorites?.filter(p => p.name !== product.name), false);
    }
  };

  // Optimistic UI Updates: Quitar favorito
  const handleRemoveFavorite = async (productName: string) => {
    if (!userId) return;

    // Actualiza la UI localmente de forma optimista.
    mutate(currentFavorites => currentFavorites?.filter(p => p.name !== productName), false);

    try {
      // Llama a la API para quitar el favorito.
      // Asumimos que el backend puede encontrar el favorito por el nombre único del producto.
      await removeFavorite(userId, productName);
      // Vuelve a validar para asegurar la consistencia.
      mutate();
    } catch (err) {
      // Si la API falla, revierte la UI al estado anterior.
      console.error(err);
      mutate(); // Re-fetch para obtener el estado correcto desde el servidor.
    }
  };

  return {
    favorites: favorites || [],
    isLoading,
    isError: !!error,
    addFavorite: handleAddFavorite,
    removeFavorite: handleRemoveFavorite,
  };
};
