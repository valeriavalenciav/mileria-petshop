import { Container, Heading, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from '../utils/get-serverside-translations';

const TermsAndConditions: NextPage = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Heading as="h1" size="xl" my={8}>
        {t('termsAndConditions.title')}
      </Heading>
      <Text>{t('termsAndConditions.description')}</Text>
    </Container>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default TermsAndConditions;
