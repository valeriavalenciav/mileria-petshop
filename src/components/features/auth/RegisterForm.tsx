
import { useForm } from 'react-hook-form';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  VStack,
  useToast,
  Box,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

import { register, login } from '@src/lib/auth';

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  correo: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  direccion: z.string().min(1, 'La dirección es requerida'),
});

type RegisterFormData = z.infer<typeof schema>;

export const RegisterForm = () => {
  const router = useRouter();
  const toast = useToast();
  const {
    handleSubmit,
    register: formRegister,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // 1. First, try to register the user normally
      const response = await register(data);

      if (response.token) {
        Cookies.set('token', response.token, { path: '/', expires: 7 });
        toast({
          title: '¡Registro exitoso!',
          description: 'Hemos creado tu cuenta y te hemos redirigido a tu perfil.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/profile');
      } else {
        throw new Error('Respuesta inesperada del servidor durante el registro.');
      }
    } catch (registerError: any) {
      // 2. If registration fails (e.g., email exists), try to log in to handle reactivation
      try {
        const loginResponse = await login({ email: data.correo, password: data.password });

        if (loginResponse.token) {
          Cookies.set('token', loginResponse.token, { path: '/', expires: 7 });
          toast({
            title: '¡Bienvenido de nuevo!',
            description: 'Hemos reactivado tu cuenta. Nos alegra tenerte de vuelta.',
            status: 'success',
            duration: 7000,
            isClosable: true,
          });
          router.push('/profile');
        } else {
           throw new Error('Respuesta inesperada del servidor durante el login.');
        }
      } catch (loginError: any) {
        // 3. If both register and login fail, show a definitive error
        toast({
          title: 'Error en el registro',
          description: 'Este correo ya está en uso o los datos son incorrectos. Por favor, intenta iniciar sesión.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} width="100%">
      <VStack spacing={6} align="center">
        <FormControl isInvalid={!!errors.nombre} width={{ base: '80%', md: '50%' }}>
          <FormLabel htmlFor="nombre">Nombre</FormLabel>
          <Input id="nombre" type="text" {...formRegister('nombre')} />
          <FormErrorMessage>{errors.nombre?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.direccion} width={{ base: '80%', md: '50%' }}>
          <FormLabel htmlFor="direccion">Dirección</FormLabel>
          <Input id="direccion" type="text" {...formRegister('direccion')} />
          <FormErrorMessage>{errors.direccion?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.correo} width={{ base: '80%', md: '50%' }}>
          <FormLabel htmlFor="correo">Correo electrónico</FormLabel>
          <Input id="correo" type="email" {...formRegister('correo')} />
          <FormErrorMessage>{errors.correo?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password} width={{ base: '80%', md: '50%' }}>
          <FormLabel htmlFor="password">Contraseña</FormLabel>
          <Input id="password" type="password" {...formRegister('password')} />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <Button colorScheme="blue" isLoading={isSubmitting} type="submit" width={{ base: '80%', md: '50%' }}>
          Crear cuenta
        </Button>
      </VStack>
    </Box>
  );
};
