
import { NextPage } from 'next';
import { Container, Heading, Text, Box, Center, Link as ChakraLink, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';

import { getServerSideTranslations } from './utils/get-serverside-translations';
import { LoginForm } from '@src/components/features/auth/LoginForm';

const LoginPage: NextPage = () => {
  return (
    <Container 
      as={VStack} 
      py={{ base: 6, lg: 16 }}
      maxW="md"
    >
        <Center mb={8}>
            <Heading as="h1">Iniciar Sesión</Heading>
        </Center>

        <Box 
            borderWidth="1px" 
            borderColor="gray.200" 
            borderRadius="md" 
            p={8}
            boxShadow="sm"
            width="100%"
        >
            <LoginForm />
        </Box>

        <Center mt={6}>
            <Text>
                ¿No tienes una cuenta?{' '}
                <NextLink href="/register" passHref>
                    <ChakraLink color="blue.500">Regístrate aquí</ChakraLink>
                </NextLink>
            </Text>
        </Center>
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
