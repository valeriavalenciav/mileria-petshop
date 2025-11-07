
import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Heading, Text, VStack } from '@chakra-ui/react';

import { FormatCurrency } from '@src/components/shared/format-currency';
import { QuantitySelector } from '@src/components/shared/quantity-selector';
import { useCart } from '@src/lib/cart';

const ShoppingCart = ({ isOpen, onClose }) => {
  const { items, clearCart, updateItemQuantity, removeItem } = useCart();

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Shopping Cart</DrawerHeader>
        <DrawerBody>
          {items.length === 0 ? (
            <Text>Your cart is empty.</Text>
          ) : (
            <VStack spacing={4}>
              {items.map(item => (
                <Box key={item.id} w="full" p={4} borderWidth="1px" borderRadius="md">
                  <Heading as="h4" size="md">{item.name}</Heading>
                  <Text>Price: <FormatCurrency value={item.price} /></Text>
                  <QuantitySelector
                    initialValue={item.quantity}
                    onChange={newQuantity => updateItemQuantity(item.id, newQuantity)}
                  />
                  <Button
                    mt={2}
                    colorScheme="red"
                    size="sm"
                    onClick={() => removeItem(item.id)}>
                    Remove
                  </Button>
                </Box>
              ))}
            </VStack>
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
