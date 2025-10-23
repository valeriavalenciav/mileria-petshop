import { Container, Heading, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { getServerSideTranslations } from './utils/get-serverside-translations';

const TermsAndConditions: NextPage = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Heading as="h1" size="xl" my={8}>
        {t('termsAndConditions.title')}
      </Heading>
      <Text>{t('termsAndConditions.description')}</Text>
      <Heading as="h2" size="lg" my={4}>
        {t('termsAndConditions.title2')}
      </Heading>
      <ul>
        <li>{t('termsAndConditions.ul1')}</li>
        <li>{t('termsAndConditions.ul2')}</li>
      </ul>
      <Heading as="h2" size="lg" my={4}>
        {t('termsAndConditions.title3')}
      </Heading>
      <ul>
        <li>{t('termsAndConditions.ul3')}</li>
        <li>{t('termsAndConditions.ul4')}</li>
        <li>{t('termsAndConditions.ul5')}</li>
      </ul>
      <Heading as="h2" size="lg" my={4}>
        {t('termsAndConditions.title4')}
      </Heading>
      <ul>
        <li>{t('termsAndConditions.ul6')}</li>
        <li>{t('termsAndConditions.ul7')}</li>
      </ul>
      <Heading as="h2" size="lg" my={4}>
        {t('termsAndConditions.title5')}
      </Heading>
      <ul>
        <li>{t('termsAndConditions.ol8')}</li>
        <li>{t('termsAndConditions.ol9')}</li>
      </ul>
      <Heading as="h2" size="lg" my={4}>
        {t('termsAndConditions.title6')}
      </Heading>
      <Text>{t('termsAndConditions.description2')}</Text>
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

export default TermsAndConditions;
