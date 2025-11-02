import { Box, BoxProps, Flex, HStack, Text, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { CartIcon } from '@src/components/shared/icons';
import ShoppingCart from '@src/components/features/shopping-cart/ShoppingCart';

export const HEADER_HEIGHT = 60;

export const Header = (props: BoxProps) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          Homepage
          </Text>
        </HStack>
      </Link>
      <HStack spacing="8">
        <Link href="/products" title={t('common.products')}>
          <Text fontSize="xl" fontWeight="bold">
            Products
          </Text>
        </Link>
        <Link href="/subscription" title={t('common.subscription')}>
          <Text fontSize="xl" fontWeight="bold">
          Subscriptions
          </Text>
        </Link>
        <Box as="button" onClick={onOpen} position="relative">
          <CartIcon />
        </Box>
      </HStack>
      <ShoppingCart isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};
