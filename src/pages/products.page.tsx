import { GetStaticProps, NextPage } from 'next';
import { getServerSideTranslations } from './utils/get-serverside-translations';

import { Container, Heading, SimpleGrid } from '@chakra-ui/react';
import { client } from '@src/lib/client';
import { PageProductCollectionQuery, PageProductFieldsFragment } from '@src/lib/__generated/sdk';
import { ProductCard } from '@src/components/features/product/ProductCard';

interface ProductsPageProps {
  products: (PageProductFieldsFragment | null)[];
}

const ProductsPage: NextPage<ProductsPageProps> = ({ products }) => {
  return (
    <Container mt={{ base: 6, lg: 16 }}>
      <Heading as="h1" mb={8}>All Products</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
        {products.map(product => (
          product && <ProductCard key={product.sys.id} product={product} />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<ProductsPageProps> = async ({ locale }) => {
  const data = await client.pageProductCollection(
    {
      locale,
      preview: false,
    }
  );

  return {
    props: {
      ...(await getServerSideTranslations(locale)),
      products: data?.pageProductCollection?.items || [],
    },
  };
};

export default ProductsPage;