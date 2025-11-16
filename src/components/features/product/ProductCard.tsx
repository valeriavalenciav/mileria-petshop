
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { CtfImage } from '@src/components/features/contentful/ctf-image';
import { FormatCurrency } from '@src/components/shared/format-currency';
import { HeartFilledIcon } from '@src/components/shared/icons/HeartFilledIcon';
import { HeartOutlineIcon } from '@src/components/shared/icons/HeartOutlineIcon';
import { useFavorites } from '@src/hooks/useFavorites';
import { useUser } from '@src/hooks/useUser';
import { PageProductFieldsFragment } from '@src/lib/__generated/sdk';

interface ProductCardProps {
  product: PageProductFieldsFragment;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { name, price, featuredProductImage, slug } = product;
  const { user } = useUser();
  const router = useRouter();

  // Obtenemos las funciones y el estado directamente del hook.
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  // La lógica para determinar si es un favorito sigue siendo la misma y es correcta.
  const isFavorited = !!name && favorites.some(fav => fav.nombre === name);

  const handleFavoriteClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      router.push('/login');
      return;
    }

    if (!name) {
      console.error('El producto no tiene un nombre para ser añadido/eliminado de favoritos.');
      return;
    }

    try {
      if (isFavorited) {
        // Si ya es un favorito, simplemente llamamos a la función `removeFavorite` del hook.
        await removeFavorite(name);
      } else {
        // Si no es un favorito, pasamos el objeto de producto completo a `addFavorite`.
        await addFavorite(product);
      }
    } catch (error) {
      console.error('Error al actualizar el estado de favorito:', error);
    }
  };

  return (
    <Box>
      <Box position="relative">
        {featuredProductImage && (
          <Link href={`/${slug}`} passHref>
            <Box as="a">
              <CtfImage {...featuredProductImage} />
            </Box>
          </Link>
        )}
        <Box
          position="absolute"
          top="2"
          right="2"
          cursor="pointer"
          onClick={handleFavoriteClick}
          aria-label={isFavorited ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          {isFavorited ? (
            <HeartFilledIcon w={8} h={8} color="#FF637E" />
          ) : (
            <HeartOutlineIcon w={8} h={8} color='gray.800' />
          )}
        </Box>
      </Box>
      <Link href={`/${slug}`} passHref>
        <VStack as="a" spacing={4} align="stretch" mt={4}>
          <Heading as="h3" size="md">{name}</Heading>
          {price && <Text><FormatCurrency value={price} /></Text>}
        </VStack>
      </Link>
    </Box>
  );
};
