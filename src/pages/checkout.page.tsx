
import { useState } from 'react';
import { Container, Heading, Text, Button, VStack, HStack, Divider, Box, Spinner, Alert, AlertIcon, Image } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

import { useCart } from '@src/context/CartProvider';
import { getServerSideTranslations } from '@src/pages/utils/get-serverside-translations';
import { FormatCurrency } from '@src/components/shared/format-currency';

const CheckoutPage: NextPage = () => {
  const { items, totalAmount } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    const apiItems = items.map(item => ({
      name: item.name,
      amount: Math.round(item.price * 100),
      quantity: item.quantity,
      // The image is for display only, so we don't need to send it to the payment API
    }));

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: apiItems }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.message || 'Failed to create checkout session.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Container mt={{ base: 6, lg: 16 }} maxW="container.lg">
      <Heading as="h1" mb={8} textAlign="center">Review Your Order</Heading>
      
      {items.length === 0 ? (
        <Box textAlign="center">
            <Text>Your cart is empty.</Text>
            <Link href="/" passHref>
                <Button as="a" mt={4} colorScheme="teal">Browse Products</Button>
            </Link>
        </Box>
      ) : (
        <VStack spacing={8} align="stretch">
            <VStack spacing={5} align="stretch" borderWidth="1px" borderRadius="md" p={{ base: 4, md: 6}}>
                {items.map(item => (
                    <HStack key={item.id} justify="space-between" spacing={4}>
                        {item.image && (
                          <Image src={item.image} alt={item.name} boxSize={{ base: '60px', md: '80px' }} objectFit="cover" borderRadius="md" />
                        )}
                        <VStack align="start" flex={1}>
                          <Text fontWeight="bold" noOfLines={2}>{item.name}</Text>
                          <Text fontSize="sm" color="gray.600">Quantity: {item.quantity}</Text>
                        </VStack>
                        <Text fontWeight="medium"><FormatCurrency value={item.price * item.quantity} /></Text>
                    </HStack>
                ))}
                <Divider my={4} />
                <HStack justify="space-between">
                    <Text fontSize="xl" fontWeight="bold">Total</Text>
                    <Text fontSize="xl" fontWeight="bold"><FormatCurrency value={totalAmount} /></Text>
                </HStack>
            </VStack>

            {error && (
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            <Button
                onClick={handleCheckout}
                colorScheme="green"
                size="lg"
                w="full"
                isLoading={isLoading}
                spinner={<Spinner />} 
                loadingText="Redirecting to secure payment..."
            >
                Proceed to Secure Payment
            </Button>
        </VStack>
      )}
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await getServerSideTranslations(locale)),
    },
  };
};

export default CheckoutPage;
