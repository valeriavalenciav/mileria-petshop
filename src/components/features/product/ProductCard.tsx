
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
import { addFavorite, removeFavorite } from '@src/lib/favorites';

interface ProductCardProps {
  product: PageProductFieldsFragment;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { name, price, featuredProductImage, slug, productId } = product;

  const { user } = useUser();
  const { favorites, mutateFavorites } = useFavorites();
  const router = useRouter();

  // CORRECTED: The ID in the favorites list is '_id'
  const isFavorited = !!productId && favorites.some(fav => fav._id === productId.toString());

  const handleFavoriteClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      router.push('/login');
      return;
    }

    // The ID from Contentful is in 'productId'
    const contentfulProductId = productId;

    if (!contentfulProductId || !name || !price) {
      console.error('Datos del producto incompletos para agregar a favoritos.');
      return;
    }

    // The data sent to the backend MUST match its expected structure
    const favoriteProductData = {
      productoId: contentfulProductId.toString(),
      nombre: name,
      precio: price,
    };

    // The ID for removal is the Contentful Product ID
    const removalId = contentfulProductId.toString();

    try {
      if (isFavorited) {
        const updatedFavorites = favorites.filter(fav => fav._id !== removalId);
        mutateFavorites(updatedFavorites, false);
        await removeFavorite(user._id, removalId);
      } else {
        const newFavorite = { 
          ...favoriteProductData, 
          _id: removalId // Simulate the backend response for optimistic update
        };
        const updatedFavorites = [...favorites, newFavorite];
        mutateFavorites(updatedFavorites, false);
        await addFavorite(user._id, favoriteProductData);
      }
      // Revalidate to sync with the server's definitive state
      mutateFavorites();
    } catch (error) {
      console.error('Failed to update favorite status:', error);
      mutateFavorites(); 
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
