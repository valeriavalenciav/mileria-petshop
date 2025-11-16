
import {
  Avatar, Container, Heading, Flex, VStack, Text, SimpleGrid, Box, Divider,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay, useDisclosure, Button, useToast
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

import { getServerSideTranslations } from './utils/get-serverside-translations';
import { ProductCard } from '@src/components/features/product/ProductCard';
import { PageProductFieldsFragment } from '@src/lib/__generated/sdk';
import { client } from '@src/lib/client';
import { getFavorites } from '@src/lib/favorites';
import { LogoutButton } from '@src/components/features/auth/LogoutButton';

interface UserProfile {
  _id: string;
  nombre: string;
  correo: string;
  direccion: string;
  rol: string;
}

interface ProfileApiResponse {
  success: boolean;
  data: UserProfile;
}

interface ProfilePageProps {
  user: UserProfile;
  favoriteProducts: (PageProductFieldsFragment | null)[];
}

const ProfilePage: NextPage<ProfilePageProps> = ({ user, favoriteProducts }) => {
  const photoURL = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${user.nombre}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    const token = Cookies.get('token');

    if (!token) {
      setIsLoading(false);
      toast({
        title: "Error de autenticación",
        description: "No se encontró tu sesión. Por favor, inicia sesión de nuevo.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('https://mileria-backend.vercel.app/api/users/delete/me', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'No se pudo procesar la respuesta del servidor.' }));
        throw new Error(errorData.message || 'Ocurrió un error inesperado.');
      }
      
      Cookies.remove('token', { path: '/' });
      localStorage.removeItem('token');
      
      toast({
        title: "Cuenta desactivada",
        description: "Tu cuenta ha sido desactivada. Puedes reactivarla en los próximos 30 días simplemente iniciando sesión.",
        status: "info",
        duration: 9000,
        isClosable: true,
      });

      setTimeout(() => router.push('/login'), 1000);

    } catch (error: any) {
      toast({
        title: "Error al desactivar la cuenta",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Container mt={{ base: 6, lg: 16 }} maxW="container.lg">
      <Heading as="h1" mb={8} textAlign={{ base: 'center', lg: 'left' }}>Perfil de Usuario</Heading>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        align="center"
        justify={{ base: 'center', lg: 'flex-start' }}
        gap={{ base: 6, lg: 8 }}
      >
        <Avatar size="xl" name={user.nombre} src={photoURL} />
        <VStack
          align="stretch"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          p={6}
          spacing={4}
          width={{ base: 'full', md: 'md' }}
        >
          <Text><strong>Nombre:</strong> {user.nombre}</Text>
          <Text><strong>Correo:</strong> {user.correo}</Text>
          <Text><strong>Dirección:</strong> {user.direccion}</Text>
          <Text><strong>Rol:</strong> {user.rol}</Text>
          
          <Divider my={2} />

          <LogoutButton />

          <Divider my={2} />

          <Text
            color="red.500"
            onClick={onOpen}
            cursor="pointer"
            fontWeight="medium"
            textAlign="center"
            _hover={{ textDecoration: 'underline' }}
          >
            Eliminar mi cuenta
          </Text>
        </VStack>
      </Flex>
      <Box mt={12}>
        <Heading as="h2" size="lg" mb={8}>Tus Productos Favoritos</Heading>
        {favoriteProducts.length > 0 ? (
            <SimpleGrid columns={{ base: 2, md: 4, lg: 7 }} spacing={4}>
                {favoriteProducts.map(
                    product => product && <ProductCard key={product.sys.id} product={product} />,
                )}
            </SimpleGrid>
        ) : (
            <Text>No tienes productos guardados en favoritos todavía.</Text>
        )}
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Desactivar tu Cuenta
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro? Tu cuenta será desactivada. Si cambias de opinión, 
              puedes reactivarla simplemente iniciando sesión o registrándote de nuevo 
              en los próximos 30 días. Después de este período, tu cuenta será 
              eliminada permanentemente.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} isDisabled={isLoading}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteAccount}
                ml={3}
                isLoading={isLoading}
                loadingText="Desactivando..."
              >
                Sí, Desactivar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async (ctx) => {
  // Primero, obtenemos el token desde las cookies en el servidor.
  const cookies = nookies.get(ctx);
  const token = cookies.token;

  // Si no hay token, el usuario no está autenticado, lo redirigimos al login.
  if (!token) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  try {
    // 1. Obtener el perfil del usuario desde nuestro backend.
    const profileResponse = await fetch('https://mileria-backend.vercel.app/api/auth/profile', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!profileResponse.ok) {
      // Si el token es inválido o expiró, limpiamos la cookie y redirigimos.
      nookies.destroy(ctx, 'token', { path: '/' });
      return { redirect: { destination: '/login', permanent: false } };
    }

    const apiResponse: ProfileApiResponse = await profileResponse.json();
    const userData = apiResponse.data;

    if (!userData || !userData._id) {
      throw new Error('La respuesta de la API no contiene un ID de usuario válido.');
    }

    // 2. Usar el _id del usuario para obtener la lista de favoritos desde nuestro backend.
    // ¡Aquí está la corrección clave! Pasamos `ctx` a `getFavorites`.
    const favoritesFromBackend = await getFavorites(userData._id, ctx);

    let favoriteProductsFromContentful: (PageProductFieldsFragment | null)[] = [];

    // 3. Si la lista de favoritos del backend no está vacía, procedemos.
    if (favoritesFromBackend && favoritesFromBackend.length > 0) {
      // 4. Extraer solo los NOMBRES de los productos favoritos.
      const favoriteProductNames = favoritesFromBackend.map(fav => fav.nombre).filter((name): name is string => !!name);
      
      // 5. Usar los nombres para consultar Contentful y obtener los detalles completos.
      if (favoriteProductNames.length > 0) {
        const contentfulResponse = await client.pageProductCollection({
          where: { name_in: favoriteProductNames }, // Usar el filtro `name_in`
          locale: ctx.locale,
        });
        favoriteProductsFromContentful = contentfulResponse.pageProductCollection?.items || [];
      }
    }

    // 6. Pasar los datos del usuario y la lista de productos de Contentful a la página.
    return {
      props: {
        ...(await getServerSideTranslations(ctx.locale)),
        user: userData,
        favoriteProducts: favoriteProductsFromContentful,
      },
    };

  } catch (error) {
    console.error("Error en getServerSideProps de perfil:", error);
    // Si algo sale mal, es más seguro desloguear al usuario y enviarlo a login.
    nookies.destroy(ctx, 'token', { path: '/' });
    return { redirect: { destination: '/login', permanent: false } };
  }
};

export default ProfilePage;
