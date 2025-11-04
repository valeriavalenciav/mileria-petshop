
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';
import { CtfImage } from '@src/components/features/contentful/ctf-image';
import { PageProductFieldsFragment } from '@src/lib/__generated/sdk';
import { FormatCurrency } from '@src/components/shared/format-currency';
import { HeartIcon } from '@src/components/shared/icons';

interface ProductCardProps {
  product: PageProductFieldsFragment;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { name, price, featuredProductImage, slug } = product;
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    console.log("Favorite status:", !isFavorited);
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
          <HeartIcon 
            w={6} 
            h={6} 
            color={isFavorited ? 'favorite' : 'gray.400'} 
            fill={isFavorited ? 'favorite' : 'none'} 
          />
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
