import { Container, Heading, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';

import { getServerSideTranslations } from './utils/get-serverside-translations';

const PrivacyPolicy: NextPage = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Heading as="h1" size="xl" my={8}>
        {t('privacyPolicy.title')}
      </Heading>
      <Text>{t('privacyPolicy.description')}</Text>
      <Heading as="h2" size="lg" my={4}>
      {t('privacyPolicy.title2')}
      </Heading>
      <Text>{t('privacyPolicy.description2')}</Text>
      <ol>
        <li>{t('privacyPolicy.ol1')}</li>
        <li>{t('privacyPolicy.ol2')}</li>
        <li>{t('privacyPolicy.ol3')}</li>
      </ol>
      <Heading as="h2" size="lg" my={4}>
      {t('privacyPolicy.title3')}
      </Heading>
      <ul>
        <li>{t('privacyPolicy.ul1')}</li>
        <li>{t('privacyPolicy.ul2')}</li>
        <li>{t('privacyPolicy.ul3')}</li>
      </ul>
      <Heading as="h2" size="lg" my={4}>
      {t('privacyPolicy.title4')}
      </Heading>
      <Text>{t('privacyPolicy.description3')}</Text>

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

export default PrivacyPolicy;
