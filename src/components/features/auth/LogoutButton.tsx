
import { Button } from '@chakra-ui/react';
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
    <Button
      colorScheme="red" // This will be overridden but is good for semantics
      backgroundColor="favorite"
      color="white"
      width="full"
      onClick={handleLogout}
      _hover={{
        backgroundColor: 'red.600' // A slightly darker red for hover
      }}
    >
      Cerrar Sesión
    </Button>
  );
};
