
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
import nookies from 'nookies';

import { register } from '@src/lib/auth';

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
      const response = await register(data);

      if (response.token) {
        nookies.set(null, 'token', response.token, { path: '/' });
        toast({
          title: '¡Registro exitoso!',
          description: 'Hemos creado tu cuenta y te hemos redirigido a tu perfil.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/profile');
      } else {
        throw new Error('Respuesta inesperada del servidor.');
      }
    } catch (error: any) {
      toast({
        title: 'Error en el registro',
        description: error.message || 'Ocurrió un problema al intentar crear tu cuenta.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} width="100%">
      <VStack spacing={6} align="center">
        <FormControl isInvalid={!!errors.nombre} width="50%">
          <FormLabel htmlFor="nombre">Nombre</FormLabel>
          <Input id="nombre" type="text" {...formRegister('nombre')} />
          <FormErrorMessage>{errors.nombre?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.correo} width="50%">
          <FormLabel htmlFor="correo">Correo electrónico</FormLabel>
          <Input id="correo" type="email" {...formRegister('correo')} />
          <FormErrorMessage>{errors.correo?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password} width="50%">
          <FormLabel htmlFor="password">Contraseña</FormLabel>
          <Input id="password" type="password" {...formRegister('password')} />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.direccion} width="50%">
          <FormLabel htmlFor="direccion">Dirección</FormLabel>
          <Input id="direccion" type="text" {...formRegister('direccion')} />
          <FormErrorMessage>{errors.direccion?.message}</FormErrorMessage>
        </FormControl>

        <Button colorScheme="blue" isLoading={isSubmitting} type="submit" width="50%">
          Crear cuenta
        </Button>
      </VStack>
    </Box>
  );
};
