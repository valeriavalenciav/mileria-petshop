
import { useForm } from 'react-hook-form';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  VStack,
  useToast, // Usaremos toasts para notificaciones
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/router';
import nookies from 'nookies';

import { register } from '@src/lib/auth'; // Importaremos una nueva función 'register'

// Definimos el esquema de validación para el formulario de registro
const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  correo: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  direccion: z.string().min(1, 'La dirección es requerida'),
});

// Los tipos de datos del formulario se infieren del esquema
type RegisterFormData = z.infer<typeof schema>;

export const RegisterForm = () => {
  const router = useRouter();
  const toast = useToast();
  const {
    handleSubmit,
    register: formRegister, // Renombramos 'register' para evitar conflicto con la función de auth
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await register(data); // Llamamos a la función de registro

      if (response.token) {
        // Si el registro es exitoso y obtenemos un token...
        nookies.set(null, 'token', response.token, { path: '/' }); // ...guardamos el token en las cookies
        toast({
          title: '¡Registro exitoso!',
          description: 'Hemos creado tu cuenta y te hemos redirigido a tu perfil.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/profile'); // ...y redirigimos al perfil
      } else {
        // Caso improbable si la API responde 200 pero sin token
        throw new Error('Respuesta inesperada del servidor.');
      }
    } catch (error: any) {
      // Si hay un error, lo mostramos en un toast
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4}>
        <FormControl isInvalid={!!errors.nombre}>
          <FormLabel htmlFor="nombre">Nombre</FormLabel>
          <Input id="nombre" type="text" {...formRegister('nombre')} />
          <FormErrorMessage>{errors.nombre?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.correo}>
          <FormLabel htmlFor="correo">Correo electrónico</FormLabel>
          <Input id="correo" type="email" {...formRegister('correo')} />
          <FormErrorMessage>{errors.correo?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">Contraseña</FormLabel>
          <Input id="password" type="password" {...formRegister('password')} />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.direccion}>
          <FormLabel htmlFor="direccion">Dirección</FormLabel>
          <Input id="direccion" type="text" {...formRegister('direccion')} />
          <FormErrorMessage>{errors.direccion?.message}</FormErrorMessage>
        </FormControl>

        <Button mt={4} colorScheme="blue" isLoading={isSubmitting} type="submit" width="full">
          Crear cuenta
        </Button>
      </VStack>
    </form>
  );
};
