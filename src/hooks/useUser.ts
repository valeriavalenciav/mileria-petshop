
import useSWR from 'swr';
import Cookies from 'js-cookie';

// The fetcher function that will be used by SWR
const fetcher = async (url: string) => {
  const token = Cookies.get('token');

  // If there's no token, the user is not logged in.
  // SWR will not proceed with the fetch.
  if (!token) {
    throw new Error('No autenticado');
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  // If the server responds with an error (e.g., token expired)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al obtener el perfil' }));
    // Remove the invalid token
    Cookies.remove('token');
    throw new Error(errorData.message || 'Sesión inválida o expirada');
  }

  const apiResponse = await response.json();
  return apiResponse.data; // Return only the user data object
};

interface UserProfile {
    id: string;
    nombre: string;
    correo: string;
    direccion: string;
    rol: string;
}

export const useUser = () => {
  const { data, error, mutate } = useSWR<UserProfile>(
    'https://mileria-backend.vercel.app/api/auth/profile',
    fetcher,
    {
      // Optional: revalidate on focus to keep data fresh, but can be disabled
      revalidateOnFocus: false,
      // Should not retry on error if it's an auth error
      shouldRetryOnError: false,
    }
  );

  return {
    user: data,
    isLoading: !error && !data,
    isError: !!error,
    error: error?.message,
    mutate, // Function to manually re-trigger the fetch
  };
};
