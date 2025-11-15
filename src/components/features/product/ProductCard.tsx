
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

  // FINAL FIX: Check for favorite status using the product NAME, as it's the only
  // common identifier between the product page and the favorites list from the backend.
  const isFavorited = !!name && favorites.some(fav => fav.nombre === name);

  const handleFavoriteClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      router.push('/login');
      return;
    }

    const contentfulProductId = productId;

    if (!contentfulProductId || !name || !price) {
      console.error('Incomplete product data to update favorites.');
      return;
    }

    try {
      if (isFavorited) {
        // Logic to REMOVE a favorite
        // The API requires the Contentful Product ID for removal.
        const removalProductId = contentfulProductId.toString();

        // Optimistic update: remove the item from the UI by filtering by name.
        const updatedFavorites = favorites.filter(fav => fav.nombre !== name);
        mutateFavorites(updatedFavorites, false);

        // Call the API with the correct user ID and product ID.
        await removeFavorite(user._id, removalProductId);

      } else {
        // Logic to ADD a favorite
        const favoriteProductData = {
          productoId: contentfulProductId.toString(),
          nombre: name,
          precio: price,
        };

        // Optimistic update: add the item to the UI.
        // We add a temporary `nombre` to make the UI consistent.
        const newOptimisticFavorite = { ...favoriteProductData, nombre: name };
        const updatedFavorites = [...favorites, newOptimisticFavorite];
        mutateFavorites(updatedFavorites, false);

        // Call the API.
        await addFavorite(user._id, favoriteProductData);
      }

      // Trigger a revalidation to sync with the server's final state.
      // This will fix the flicker.
      mutateFavorites();

    } catch (error) {
      console.error('Failed to update favorite status:', error);
      // If an error occurs, revert the optimistic update by re-fetching.
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
