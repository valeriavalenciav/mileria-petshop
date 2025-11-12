
import { NextPage } from 'next';
import { Container, Heading, Text, Box, Center, Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';

import { RegisterForm } from '@src/components/features/auth/RegisterForm';
import { getServerSideTranslations } from './utils/get-serverside-translations';

const RegisterPage: NextPage = () => {
  return (
    <Container mt={{ base: 6, lg: 16 }} maxW="md">
        <Center mb={8}>
            <Heading as="h1">Crear una cuenta</Heading>
        </Center>

        <Box 
            borderWidth="1px" 
            borderColor="gray.200" 
            borderRadius="md" 
            p={8}
            boxShadow="sm"
        >
            <RegisterForm />
        </Box>

        <Center mt={6}>
            <Text>
                ¿Ya tienes una cuenta?{' '}
                <NextLink href="/login" passHref>
                    <ChakraLink color="blue.500">Inicia sesión aquí</ChakraLink>
                </NextLink>
            </Text>
        </Center>
    </Container>
  );
};

export const getStaticProps = async ({ locale }: { locale?: string }) => ({
    props: {
      ...(await getServerSideTranslations(locale)),
    },
});

export default RegisterPage;
