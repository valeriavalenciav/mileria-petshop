
import useSWR from 'swr';
import { useUser } from '@src/hooks/useUser';
import { getFavorites } from '@src/lib/favorites';

// El fetcher para SWR usará nuestra función getFavorites
// La clave SWR (`key`) será un array que contiene el nombre y el userId
const favoritesFetcher = async ([key, userId]: [string, string]) => {
    // Solo intentamos buscar favoritos si hay un userId
    if (!userId) {
      return [];
    }
    return getFavorites(userId);
};

export const useFavorites = () => {
  const { user } = useUser();
  const userId = user?.id;

  // Usamos el userId en la clave de SWR. 
  // Si userId es nulo, SWR no ejecutará el fetcher.
  const { data, error, mutate, isLoading } = useSWR(
    userId ? ['favorites', userId] : null,
    favoritesFetcher,
    {
      revalidateOnFocus: false, // Opcional: para no recargar en cada foco de la ventana
    }
  );

  return {
    favorites: data || [], // Devuelve el array de favoritos, o un array vacío
    isLoading: isLoading,
    isError: !!error,
    // La función mutate nos permitirá actualizar la UI al instante
    mutateFavorites: mutate,
  };
};
