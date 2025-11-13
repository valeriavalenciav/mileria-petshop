
import { Avatar, Container, Heading, HStack, VStack, Text, SimpleGrid, Box, Divider } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';

import { getServerSideTranslations } from './utils/get-serverside-translations';
import { ProductCard } from '@src/components/features/product/ProductCard';
import { PageProductFieldsFragment } from '@src/lib/__generated/sdk';
import { client } from '@src/lib/client';
import { getFavorites } from '@src/lib/favorites';
import { LogoutButton } from '@src/components/features/auth/LogoutButton';

// 1. Interfaz actualizada para coincidir con la respuesta de la API
interface UserProfile {
  id: string;
  nombre: string;
  correo: string;
  direccion: string;
  rol: string;
}

// Interfaz para la respuesta completa de la API de perfil
interface ProfileApiResponse {
  success: boolean;
  data: UserProfile;
}

interface ProfilePageProps {
  user: UserProfile;
  favoriteProducts: (PageProductFieldsFragment | null)[];
}

const ProfilePage: NextPage<ProfilePageProps> = ({ user, favoriteProducts }) => {
  // Usamos el nombre para generar un avatar único y consistente
  const photoURL = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${user.nombre}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;

  return (
    <Container mt={{ base: 6, lg: 16 }} maxW="container.lg">
      <Heading as="h1" mb={8}>Perfil de Usuario</Heading>
      <HStack spacing={8} alignItems="flex-start">
        <Avatar size="xl" name={user.nombre} src={photoURL} />
        {/* 3. Componente actualizado para mostrar toda la información */}
        <VStack
          align="stretch" // Changed to stretch to allow full-width button
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          p={6}
          spacing={4} // Adjusted spacing
          flex={1}
        >
          <Text><strong>Nombre:</strong> {user.nombre}</Text>
          <Text><strong>Correo:</strong> {user.correo}</Text>
          <Text><strong>Dirección:</strong> {user.direccion}</Text>
          <Text><strong>Rol:</strong> {user.rol}</Text>
          
          <Divider my={2} />

          <LogoutButton />
        </VStack>
      </HStack>
      <Box mt={12}>
        <Heading as="h2" size="lg" mb={8}>Tus Productos Favoritos</Heading>
        {favoriteProducts.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
                {favoriteProducts.map(
                    product => product && <ProductCard key={product.sys.id} product={product} />,
                )}
            </SimpleGrid>
        ) : (
            <Text>No tienes productos guardados en favoritos todavía.</Text>
        )}
      </Box>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async (ctx) => {
  const cookies = nookies.get(ctx);
  const token = cookies.token;

  if (!token) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  try {
    const profileResponse = await fetch('https://mileria-backend.vercel.app/api/auth/profile', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!profileResponse.ok) {
      throw new Error('Token inválido o expirado, no se pudo obtener el perfil.');
    }

    // 2. Procesamos la respuesta anidada de la API
    const apiResponse: ProfileApiResponse = await profileResponse.json();
    const userData = apiResponse.data; // Extraemos el objeto de usuario

    if (!userData) {
        throw new Error('La respuesta de la API no contiene datos del usuario.');
    }

    // Usamos 'correo' para obtener los favoritos
    const favoriteProductIds = getFavorites(userData.correo);
    const favoriteProductsData = await client.pageProductCollection({
      where: { productId_in: favoriteProductIds.map(Number) },
      locale: ctx.locale,
    });

    return {
      props: {
        ...(await getServerSideTranslations(ctx.locale)),
        user: userData,
        favoriteProducts: favoriteProductsData.pageProductCollection?.items || [],
      },
    };

  } catch (error) {
    console.error("Error en getServerSideProps de perfil:", error);
    // Si algo falla (token inválido, API caída, etc.), destruimos la cookie y redirigimos
    nookies.destroy(ctx, 'token', { path: '/' });
    return { redirect: { destination: '/login', permanent: false } };
  }
};

export default ProfilePage;
