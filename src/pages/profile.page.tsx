
import { Avatar, Container, Heading, HStack, VStack, Text, SimpleGrid } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';

import { getServerSideTranslations } from './utils/get-serverside-translations';
import { ProductCard } from '@src/components/features/product/ProductCard';
import { PageProductFieldsFragment } from '@src/lib/__generated/sdk';
import { client } from '@src/lib/client';
import { getFavorites } from '@src/lib/favorites';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface ProfilePageProps {
  user: UserProfile;
  favoriteProducts: (PageProductFieldsFragment | null)[];
}

const ProfilePage: NextPage<ProfilePageProps> = ({ user, favoriteProducts }) => {
  const photoURL = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${user.name}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;

  return (
    <Container mt={{ base: 6, lg: 16 }}>
      <Heading as="h1" mb={8}>User Profile</Heading>
      <HStack spacing={8} alignItems="center">
        <Avatar size="xl" name={user.name} src={photoURL} />
        <VStack
          align="left"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          p={4}
        >
          <Text><strong>Name:</strong> {user.name}</Text>
          <Text><strong>Email:</strong> {user.email}</Text>
        </VStack>
      </HStack>
      <Heading as="h2" size="lg" mt={12} mb={8}>Your Favorite Products</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
        {favoriteProducts.map(
          product => product && <ProductCard key={product.sys.id} product={product} />,
        )}
      </SimpleGrid>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async (ctx) => {
  const cookies = nookies.get(ctx);
  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const profileResponse = await fetch('https://mileria-backend.vercel.app/api/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error('Token inválido o expirado');
    }

    const userData: UserProfile = await profileResponse.json();

    const favoriteProductIds = getFavorites(userData.email);
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
    nookies.destroy(ctx, 'token');
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};

export default ProfilePage;
