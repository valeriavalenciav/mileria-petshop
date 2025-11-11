
import { useState } from 'react';
import { Container, Heading, Text, Button, VStack, HStack, Divider, Box, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

import { useCart } from '@src/context/CartProvider';
import { getServerSideTranslations } from '@src/pages/utils/get-serverside-translations';

const CheckoutPage: NextPage = () => {
  const { items, totalAmount, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    // Map cart items to the format expected by our new API endpoint
    const apiItems = items.map(item => ({
      name: item.name,
      amount: Math.round(item.price * 100), // Convert price to cents
      quantity: item.quantity,
    }));

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: apiItems }), // Send items array
      });

      const data = await res.json();

      if (data.url) {
        // Redirect to Stripe's hosted checkout page
        window.location.href = data.url;
        // The cart will be cleared upon successful payment via a webhook or on the payment status page in a real app
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
    <Container mt={{ base: 6, lg: 16 }} maxW="container.md">
      <Heading as="h1" mb={8}>Shopping Cart</Heading>
      
      {items.length === 0 ? (
        <Box textAlign="center">
            <Text>Your cart is empty.</Text>
            <Link href="/products" passHref>
                <Button as="a" mt={4} colorScheme="teal">Browse Products</Button>
            </Link>
        </Box>
      ) : (
        <VStack spacing={6} align="stretch">
            <VStack spacing={4} align="stretch" borderWidth="1px" borderRadius="md" p={4}>
                {items.map(item => (
                    <HStack key={item.id} justify="space-between">
                        <Text fontWeight="medium">{item.name} (x{item.quantity})</Text>
                        <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                    </HStack>
                ))}
                <Divider />
                <HStack justify="space-between">
                    <Text fontSize="xl" fontWeight="bold">Total</Text>
                    <Text fontSize="xl" fontWeight="bold">${totalAmount.toFixed(2)}</Text>
                </HStack>
            </VStack>

            {error && (
                <Alert status="error">
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
                loadingText="Redirecting to payment..."
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
