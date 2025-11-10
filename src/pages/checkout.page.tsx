
import { useState, useEffect } from 'react';
import { Container, Heading, Text } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next'; // Changed to GetServerSideProps
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { useCart } from '@src/context/CartProvider'; // Corrected the import path
import { getServerSideTranslations } from '@src/pages/utils/get-serverside-translations';
import { CheckoutForm } from '@src/components/features/checkout/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutPage: NextPage = () => {
  const [clientSecret, setClientSecret] = useState('');
  const { items, totalAmount } = useCart(); // Now using the correct cart context

  useEffect(() => {
    const amountInCents = Math.round(totalAmount * 100);

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
    // If amount is 0, clientSecret remains empty and the form won't be shown.
  }, [totalAmount]); // Depend on totalAmount from the global context

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

// Changed from getStaticProps to getServerSideProps for dynamic pages
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await getServerSideTranslations(locale)),
    },
  };
};

export default CheckoutPage;
