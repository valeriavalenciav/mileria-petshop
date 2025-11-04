
import { GetServerSideProps, NextPage } from 'next';
import { getServerSideTranslations } from './utils/get-serverside-translations';

import { Avatar, Container, Heading, HStack, VStack, Text } from '@chakra-ui/react';

// Placeholder for user data. In a real application, this would
// come from a database or an authentication service.
interface User {
  name: string;
  email: string;
  photoURL: string;
}

interface ProfilePageProps {
  user: User;
}

const ProfilePage: NextPage<ProfilePageProps> = ({ user }) => {
  return (
    <Container mt={{ base: 6, lg: 16 }}>
      <Heading as="h1" mb={8}>User Profile</Heading>
      <HStack spacing={8} alignItems="flex-start">
        <Avatar size="xl" name={user.name} src={user.photoURL} />
        <VStack align="left">
          <Text><strong>Name:</strong> {user.name}</Text>
          <Text><strong>Email:</strong> {user.email}</Text>
        </VStack>
      </HStack>
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

  return {
    props: {
      ...(await getServerSideTranslations(locale)),
      user,
    },
  };
};

export default ProfilePage;
