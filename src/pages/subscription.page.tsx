import { Box, Container, Heading, Text, Flex, VStack, HStack, Divider } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { getServerSideTranslations } from './utils/get-serverside-translations';
import { useState } from 'react';

const SubscriptionPage: NextPage = () => {
  const { t } = useTranslation();
  const plans = t('subscription.plans', { returnObjects: true }) as any[];
  const [selectedPlan, setSelectedPlan] = useState('Premium');

  return (
    <Container maxW="container.xl" py={10}>
      <Heading as="h1" size="xl" mb={4} textAlign="center">
        {t('subscription.title')}
      </Heading>
      <Text textAlign="center" mb={10}>
        {t('subscription.description')}
      </Text>
      <Flex direction={{ base: 'column', md: 'row' }} justify="center" align="stretch" gap={6}>
        {plans.map((plan, index) => (
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
          >
            {plan.title === 'Premium' && (
              <Box className="most-popular-banner">
                {t('subscription.mostPopular')}
              </Box>
            )}
            <VStack align="stretch" spacing={5}>
              <Box 
                className={`subscription-card-header subscription-card-header-${plan.title.toLowerCase()}`}>
                <Heading as="h3" size="md">{plan.title}</Heading>
                <Text>{plan.resolution}</Text>
              </Box>
              
              <VStack align="stretch" spacing={4}>
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
          {/*       <HStack justify="space-between">
                  <Text>{plan.downloadDevices}</Text>
                  <Text>{plan.downloadDevicesValue}</Text>
                </HStack> */}
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
