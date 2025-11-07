
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';
import { CtfImage } from '@src/components/features/contentful/ctf-image';
import { PageProductFieldsFragment } from '@src/lib/__generated/sdk';
import { FormatCurrency } from '@src/components/shared/format-currency';
import { HeartFilledIcon } from '@src/components/shared/icons/HeartFilledIcon';
import { HeartOutlineIcon } from '@src/components/shared/icons/HeartOutlineIcon';

interface ProductCardProps {
  product: PageProductFieldsFragment;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { name, price, featuredProductImage, slug, productId } = product;
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const newFavoritedStatus = !isFavorited;
    setIsFavorited(newFavoritedStatus);

    try {
      const method = newFavoritedStatus ? 'POST' : 'DELETE';
      await fetch('/api/favorites', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'mileria@example.com', productId }),
      });
    } catch (error) {
      console.error('Failed to update favorite status:', error);
      // Revert the state if the API call fails
      setIsFavorited(!newFavoritedStatus);
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
        >
          {isFavorited ? (
            <HeartFilledIcon 
              w={8} 
              h={8} 
              color="#FF637E"
            />
          ) : (
            <HeartOutlineIcon 
              w={8} 
              h={8} 
              color='gray.800'
            />
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
