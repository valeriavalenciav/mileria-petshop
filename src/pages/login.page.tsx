
import { Container } from '@chakra-ui/react';
import { NextPage } from 'next';

import { getServerSideTranslations } from './utils/get-serverside-translations';
import { LoginForm } from '@src/components/features/auth/LoginForm';

const LoginPage: NextPage = () => {
  return (
    <Container
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="calc(100vh - 200px)" // Resta la altura del header/footer si es necesario
      py={{ base: 6, lg: 16 }}
    >
      <LoginForm />
    </Container>
  );
};

export const getStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await getServerSideTranslations(locale)),
    },
  };
};

export default LoginPage;
