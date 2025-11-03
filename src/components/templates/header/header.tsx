import {
  Box,
  BoxProps,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import ShoppingCart from '@src/components/features/shopping-cart/ShoppingCart';
import { CartIcon, MenuIcon } from '@src/components/shared/icons';

export const HEADER_HEIGHT = 60;

export const Header = (props: BoxProps) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const MobileNav = () => (
    <Flex width="100%" justifyContent="space-between" alignItems="center">
      <Box visibility="hidden"> 
        <IconButton aria-label="Options" icon={<MenuIcon />} variant="outline" />
      </Box>

      <Box as="button" onClick={onOpen} position="relative">
        <CartIcon />
      </Box>

      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<MenuIcon />}
          variant="outline"
        />
        <MenuList>
          <MenuItem as={Link} href="/">
            Homepage
          </MenuItem>
          <MenuItem as={Link} href="/products">
            Products
          </MenuItem>
          <MenuItem as={Link} href="/subscription">
            Subscriptions
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );

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
      {isMobile ? (
        <MobileNav />
      ) : (
        <>
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
        </>
      )}
      <ShoppingCart isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};
