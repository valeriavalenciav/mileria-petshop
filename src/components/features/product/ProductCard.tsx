import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { CtfImage } from '@src/components/features/contentful/ctf-image';
import { PageProductFieldsFragment } from '@src/lib/__generated/sdk';
import { FormatCurrency } from '@src/components/shared/format-currency';

interface ProductCardProps {
  product: PageProductFieldsFragment;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { name, price, featuredProductImage, slug } = product;

  return (
    <Link href={`/${slug}`} passHref>
      <VStack as="a" spacing={4} align="stretch">
        {featuredProductImage && (
          <Box>
            <CtfImage {...featuredProductImage} />
          </Box>
        )}
        <Heading as="h3" size="md">{name}</Heading>
        {price && <Text><FormatCurrency value={price} /></Text>}
      </VStack>
    </Link>
  );
};