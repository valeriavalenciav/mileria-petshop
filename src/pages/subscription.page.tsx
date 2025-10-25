import { Box, Heading, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';

const SubscriptionPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <Box p={{ base: 4, md: 12, lg: 12 }}>
      <Heading as="h1" size="xl" mb={4}>
        Subscription to organic and artisanal pet products
      </Heading>
      <Text>
        We offer a subscription service for organic and artisanal pet products. You will receive a monthly box with a selection of our best products.
      </Text>
    </Box>
  );
};

export default SubscriptionPage;
