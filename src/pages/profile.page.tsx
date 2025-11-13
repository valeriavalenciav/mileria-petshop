
import { Avatar, Container, Heading, Flex, VStack, Text, SimpleGrid, Box, Divider } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';

import { getServerSideTranslations } from './utils/get-serverside-translations';
import { ProductCard } from '@src/components/features/product/ProductCard';
import { PageProductFieldsFragment } from '@src/lib/__generated/sdk';
import { client } from '@src/lib/client';
import { getFavorites } from '@src/lib/favorites';
import { LogoutButton } from '@src/components/features/auth/LogoutButton';

interface UserProfile {
  id: string;
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

  return (
    <Container mt={{ base: 6, lg: 16 }} maxW="container.lg">
      <Heading as="h1" mb={8} textAlign="center">Perfil de Usuario</Heading>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        align="center"
        justify="center"
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
        </VStack>
      </Flex>
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

    const apiResponse: ProfileApiResponse = await profileResponse.json();
    const userData = apiResponse.data; 

    if (!userData) {
        throw new Error('La respuesta de la API no contiene datos del usuario.');
    }

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
    nookies.destroy(ctx, 'token', { path: '/' });
    return { redirect: { destination: '/login', permanent: false } };
  }
};

export default ProfilePage;
