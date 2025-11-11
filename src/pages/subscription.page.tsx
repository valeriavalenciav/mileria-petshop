
import { Box, Button, Container, Heading, Text, Flex, VStack, HStack, Divider, Spinner, Spacer } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import { getServerSideTranslations } from './utils/get-serverside-translations';

// Initialize Stripe.js with your publishable key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Stripe Price IDs.
const STRIPE_PRICE_IDS = {
  Basic: 'price_1SS1uwJuAMA27hfRcFT6niD1',
  Premium: 'price_1SS27MJuAMA27hfRNzzBzCPn',
  Standard: 'price_1SS249JuAMA27hfRsUmfWjlg',
};

const SubscriptionPage: NextPage = () => {
  const { t } = useTranslation();
  const plans = t('subscription.plans', { returnObjects: true }) as any[];
  const [selectedPlan, setSelectedPlan] = useState('Premium');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscription = async (planTitle: string) => {
    setIsLoading(true);

    const priceId = STRIPE_PRICE_IDS[planTitle];
    if (!priceId || priceId.includes('YOUR_')) {
      console.error(`Stripe Price ID for plan "${planTitle}" is not configured.`);
      alert('This subscription plan is not available at the moment. Please contact support.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/create-subscription-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      if (!res.ok) {
        throw new Error('Failed to create Stripe checkout session.');
      }

      const { url } = await res.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Stripe session URL not found.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Heading as="h1" size="xl" mb={4} textAlign="center">
        {t('subscription.title')}
      </Heading>
      <Text textAlign="center" mb={10}>
        {t('subscription.description')}
      </Text>
      <Flex direction={{ base: 'column', md: 'row' }} justify="center" align="stretch" gap={6}>
        {plans.map((plan) => (
          <Box
            key={plan.title}
            className="subscription-card"
            borderColor={selectedPlan === plan.title ? '#02AB08' : 'gray.200'}
            borderWidth={selectedPlan === plan.title ? '2px' : '1px'}
            transform={selectedPlan === plan.title ? 'scale(1.05)' : 'none'}
            transition="transform 0.2s, border-color 0.2s, box-shadow 0.2s"
            _hover={{
              transform: 'scale(1.05)',
              boxShadow: 'lg',
            }}
            onClick={() => setSelectedPlan(plan.title)}
            cursor="pointer"
            display="flex" // Ensure the card itself is a flex container
            flexDirection="column" // Stack children vertically
          >
            {plan.title === 'Premium' && (
              <Box className="most-popular-banner">
                {t('subscription.mostPopular')}
              </Box>
            )}
            <VStack align="stretch" spacing={5} flex="1" display="flex" flexDirection="column">
              <Box className={`subscription-card-header subscription-card-header-${plan.title.toLowerCase()}`}>
                <Heading as="h3" size="md">{plan.title}</Heading>
                <Text>{plan.resolution}</Text>
              </Box>
              
              <VStack align="stretch" spacing={4} p={6} flex="1" display="flex" flexDirection="column">
                <HStack justify="space-between">
                  <Text>{plan.monthlyPrice}</Text>
                  <Text fontWeight="bold">{plan.price}</Text>
                </HStack>
                <Divider />
                <HStack justify="space-between">
                  <Text>{plan.audioAndVideoQuality}</Text>
                  <Text>{plan.audioAndVideoQualityValue}</Text>
                </HStack>
                <Divider />
                <HStack justify="space-between">
                  <Text>{plan.resolutionTitle}</Text>
                  <Text>{plan.resolutionValue}</Text>
                </HStack>
                <Divider />
                {plan.spatialAudio && (
                  <>
                    <HStack justify="space-between">
                      <Text>{plan.spatialAudio}</Text>
                      <Text>{plan.spatialAudioValue}</Text>
                    </HStack>
                    <Divider />
                  </>
                )}
                <HStack justify="space-between">
                  <Text>{plan.supportedDevices}</Text>
                  <Text textAlign="right">{plan.supportedDevicesValue}</Text>
                </HStack>
                <Divider />
                <HStack justify="space-between">
                  <Text>{plan.devicesAtHome}</Text>
                  <Text>{plan.devicesAtHomeValue}</Text>
                </HStack>
                <Divider />
                
                {/* Spacer will push the button to the bottom */}
                <Spacer />

                <Button
                  mt={4}
                  colorScheme="green"
                  onClick={() => handleSubscription(plan.title)}
                  isDisabled={isLoading && selectedPlan === plan.title}
                >
                  {isLoading && selectedPlan === plan.title ? <Spinner /> : `Choose ${plan.title}`}
                </Button>
              </VStack>
            </VStack>
          </Box>
        ))}
      </Flex>
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

export default SubscriptionPage;
