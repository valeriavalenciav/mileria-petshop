
import { Avatar, Container, Heading, HStack, VStack, Text, SimpleGrid } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';

import { getServerSideTranslations } from './utils/get-serverside-translations';

import { ProductCard } from '@src/components/features/product/ProductCard';
import { PageProductFieldsFragment } from '@src/lib/__generated/sdk';
import { client } from '@src/lib/client';
import { getFavorites } from '@src/lib/favorites';

// Placeholder for user data. In a real application, this would
// come from a database or an authentication service.
interface User {
  name: string;
  email: string;
  photoURL: string;
}

interface ProfilePageProps {
  user: User;
  favoriteProducts: (PageProductFieldsFragment | null)[];
}

const ProfilePage: NextPage<ProfilePageProps> = ({ user, favoriteProducts }) => {
  return (
    <Container mt={{ base: 6, lg: 16 }}>
      <Heading as="h1" mb={8}>User Profile</Heading>
      <HStack spacing={8} alignItems="center">
        <Avatar size="xl" name={user.name} src={user.photoURL} />
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

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async ({ locale }) => {
  const name = 'Mileria';
  // In a real application, you would fetch user data from an API or session.
  const user: User = {
    name,
    email: 'mileria@example.com',
    photoURL: `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`,
  };

  const favoriteProductIds = getFavorites(user.email);

  const favoriteProductsData = await client.pageProductCollection({
    where: {
      productId_in: favoriteProductIds.map(Number),
    },
    locale,
  });

  return {
    props: {
      ...(await getServerSideTranslations(locale)),
      user,
      favoriteProducts: favoriteProductsData.pageProductCollection?.items || [],
    },
  };
};

export default ProfilePage;
