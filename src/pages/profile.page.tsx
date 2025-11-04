
import { GetServerSideProps, NextPage } from 'next';
import { getServerSideTranslations } from './utils/get-serverside-translations';

import { Container, Heading } from '@chakra-ui/react';

// Placeholder for user data. In a real application, this would
// come from a database or an authentication service.
interface User {
  name: string;
  email: string;
}

interface ProfilePageProps {
  user: User;
}

const ProfilePage: NextPage<ProfilePageProps> = ({ user }) => {
  return (
    <Container mt={{ base: 6, lg: 16 }}>
      <Heading as="h1" mb={8}>User Profile</Heading>
      <div>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async ({ locale }) => {
  // In a real application, you would fetch user data from an API or session.
  const user: User = {
    name: 'Mileria',
    email: 'mileria@example.com',
  };

  return {
    props: {
      ...(await getServerSideTranslations(locale)),
      user,
    },
  };
};

export default ProfilePage;
