import { Box, BoxProps, Flex, HStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import MileriaLogo from '@icons/mileria.svg';

export const HEADER_HEIGHT = 60;

export const Header = (props: BoxProps) => {
  const { t } = useTranslation();

  return (
    <Flex
      as="nav"
      justifyContent="space-between"
      align="center"
      pl={{ base: 4, md: 12, lg: 12 }}
      pr={{ base: 4, md: 12, lg: 12 }}
      height={`${HEADER_HEIGHT}px`}
      zIndex="2"
      {...props}>
      <Link href="/" title={t('common.homepage')}>
        <HStack spacing="3">
          <Text fontSize="xl" fontWeight="bold">
            Mileria PetShop
          </Text>
        </HStack>
      </Link>
    </Flex>
  );
};
