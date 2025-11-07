import { Container, Heading, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';

import { getServerSideTranslations } from './utils/get-serverside-translations';

const AccessibilityStatement: NextPage = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Heading as="h1" size="xl" my={8}>
        {t('accessibilityStatement.title')}
      </Heading>
      <Text>{t('accessibilityStatement.description')}</Text>
      <Heading as="h2" size="lg" my={4}>
        {t('accessibilityStatement.title2')}
      </Heading>
      <Text>{t('accessibilityStatement.description2')}</Text>
      <ul>
        <li>{t('accessibilityStatement.ul1')}</li>
        <li>{t('accessibilityStatement.ul2')}</li>
        <li>{t('accessibilityStatement.ul3')}</li>
        <li>{t('accessibilityStatement.ul4')}</li>
      </ul>
      <Heading as="h2" size="lg" my={4}>
        {t('accessibilityStatement.title3')}
      </Heading>
      <Text>{t('accessibilityStatement.description3')}</Text>
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

export default AccessibilityStatement;
