import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Heading, Text } from '@chakra-ui/react';

import { FormatCurrency } from '@src/components/shared/format-currency';
import { useCart } from '@src/lib/cart';

const ShoppingCart = ({ isOpen, onClose }) => {
  const { items, clearCart } = useCart();

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Shopping Cart</DrawerHeader>
        <DrawerBody>
          {items.length === 0 ? (
            <Text>Your cart is empty.</Text>
          ) : (
            items.map(item => (
              <Box key={item.id} mb={4}>
                <Heading as="h4" size="md">{item.name}</Heading>
                <Text>Price: <FormatCurrency value={item.price} /></Text>
                <Text>Quantity: {item.quantity}</Text>
              </Box>
            ))
          )}
        </DrawerBody>
        <DrawerFooter>
          {items.length > 0 && (
            <Button colorScheme="red" mr={3} onClick={clearCart}>
              Clear Cart
            </Button>
          )}
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ShoppingCart;
