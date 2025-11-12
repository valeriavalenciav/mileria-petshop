
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Box,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { login } from '@src/lib/auth';

type LoginFormInputs = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(data);

      if (response.token) {
        localStorage.setItem('token', response.token);
        Cookies.set('token', response.token, { expires: 7 });
        console.log('¡Inicio de sesión exitoso! Token guardado.');
        router.push('/profile');
      } else {
        setError('Respuesta inesperada del servidor.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al iniciar sesión.');
    }

    setIsLoading(false);
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} width="100%" maxWidth="400px">
      <VStack spacing={6} align="stretch">
        <Heading as="h2" size="lg" textAlign="center">
          Iniciar Sesión
        </Heading>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            type="email"
            {...register('email', {
              required: 'El email es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Formato de email inválido',
              },
            })}
          />
          {errors.email && <Box color="red.500" mt={2}>{errors.email.message}</Box>}
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">Contraseña</FormLabel>
          <Input
            id="password"
            type="password"
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres',
              },
            })}
          />
          {errors.password && <Box color="red.500" mt={2}>{errors.password.message}</Box>}
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isLoading}
          loadingText="Iniciando..."
          width="full"
        >
          Entrar
        </Button>
      </VStack>
    </Box>
  );
};
