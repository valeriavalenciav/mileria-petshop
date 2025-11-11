
import { Box, Container, Heading, Text, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription, Button, Center } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { getServerSideTranslations } from './utils/get-serverside-translations';

interface VerificationResult {
  status?: string;
  payment_status?: string;
  customer_email?: string;
  error?: string;
}

const PaymentStatusPage: NextPage = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session_id) {
      setIsLoading(false);
      return;
    }

    const verifySession = async () => {
      try {
        const res = await fetch('/api/verify-stripe-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error?.message || 'Verification failed');
        }

        setResult(data);
      } catch (error: any) {
        setResult({ error: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [session_id]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Center flexDirection="column" h="200px">
          <Spinner size="xl" />
          <Text mt={4}>Verifying your payment, please wait...</Text>
        </Center>
      );
    }

    if (result?.error) {
      return (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Verification Error!</AlertTitle>
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      );
    }

    if (result?.status === 'complete') {
      return (
        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius="lg"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Payment Successful!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Thank you for your subscription. A confirmation has been sent to {result.customer_email}.
          </AlertDescription>
          <Link href="/" passHref>
            <Button as="a" mt={4} colorScheme="green">
              Go to Homepage
            </Button>
          </Link>
        </Alert>
      );
    }

    return (
      <Alert
        status="warning"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
        borderRadius="lg"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Payment Incomplete or Canceled
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          It looks like the payment process was not completed. Please try again.
        </AlertDescription>
        <Link href="/subscription" passHref>
          <Button as="a" mt={4} colorScheme="yellow">
            Return to Subscriptions
          </Button>
        </Link>
      </Alert>
    );
  };

  return (
    <Container maxW="container.lg" py={20}>
        {renderContent()}
    </Container>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await getServerSideTranslations(locale)),
    },
  };
};

export default PaymentStatusPage;
