import { Container, Box, Text, Link, useTheme, Flex } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';
import { SocialMedia } from '@src/components/shared/social-media';

export const Footer = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box
      as="footer"
      width="full"
      py={{ base: 10, lg: 16 }}
      mt="auto"
      borderTop="1px"
      bg="footerBg"
      borderColor={theme.f36.gray200}>
      <Container>
        <Flex justify="space-between" align="center" mb={8}>
        <Text>{t('common.aboutUs')}</Text>
        <SocialMedia />
        </Flex>
        <Text>{t('common.description1')}</Text>
        <Text mb={8}>{t('common.description2')}</Text>
        <Flex mt={8} direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
          <Flex>
            <NextLink href="/privacy-policy" passHref>
              <Link mr={4}>{t('footer.privacyPolicy')}</Link>
            </NextLink>
            <NextLink href="/accessibility-statement" passHref>
              <Link mr={4}>{t('footer.accessibilityStatement')}</Link>
            </NextLink>
            <NextLink href="/terms-and-conditions" passHref>
              <Link>{t('footer.termsAndConditions')}</Link>
            </NextLink>
          </Flex>
          <Text mt={{ base: 4, md: 0 }}>{t('footer.copyright')}</Text>
        </Flex>
      </Container>
    </Box>
  );
};
