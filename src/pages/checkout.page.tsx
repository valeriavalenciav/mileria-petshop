
import { useState, useEffect } from 'react';
import { Container, Heading, Text } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { useCart } from '@src/lib/cart';
import { getServerSideTranslations } from '@src/pages/utils/get-serverside-translations';
import { CheckoutForm } from '@src/components/features/checkout/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutPage: NextPage = () => {
  const [clientSecret, setClientSecret] = useState('');
  const { items } = useCart();

  useEffect(() => {
    // Calculate the total amount from the cart items.
    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const amountInCents = Math.round(totalAmount * 100);

    // Only create a PaymentIntent if there are items in the cart.
    if (amountInCents > 0) {
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInCents }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        });
    }
  }, [items]); // The dependency array ensures this runs when the cart changes.

  const appearance: StripeElementsOptions['appearance'] = {
    theme: 'stripe',
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <Container mt={{ base: 6, lg: 16 }}>
      <Heading as="h1" mb={8}>Checkout</Heading>
      
      {clientSecret && items.length > 0 ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      ) : (
        <Text>Your cart is empty or the payment session is still loading.</Text>
      )}
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
