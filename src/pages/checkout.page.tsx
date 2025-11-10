
import { Container, Heading } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';

import { getServerSideTranslations } from './utils/get-serverside-translations';

const CheckoutPage: NextPage = () => {
  return (
    <Container mt={{ base: 6, lg: 16 }}>
      <Heading as="h1" mb={8}>Checkout</Heading>
      {/* Add checkout form and summary here */}
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await getServerSideTranslations(locale)),
    },
  };
};

export default CheckoutPage;
