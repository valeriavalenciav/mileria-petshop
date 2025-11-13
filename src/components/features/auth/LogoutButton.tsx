
import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the token from cookies and local storage
    Cookies.remove('token');
    localStorage.removeItem('token');

    // Redirect to the login page
    router.push('/login');
  };

  return (
    <Text
      color="favorite"
      onClick={handleLogout}
      cursor="pointer"
      fontWeight="medium"
      _hover={{
        textDecoration: 'underline',
      }}
    >
      Cerrar Sesión
    </Text>
  );
};
