
import { Box, Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';

import { FormatCurrency } from '@src/components/shared/format-currency';
import { QuantitySelector } from '@src/components/shared/quantity-selector';
import { useCart } from '@src/context/CartProvider';

const ShoppingCart = ({ isOpen, onClose }) => {
  // 1. Get totalAmount from the useCart hook
  const { items, clearCart, updateItemQuantity, removeItem, totalAmount } = useCart();

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

        {/* 2. Modify the footer to include the total and a divider */}
        <DrawerFooter>
          <Box w="full">
            {items.length > 0 && (
              <Box mb={4}>             
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="xl" fontWeight="bold">
                    Total:
                  </Text>
                  <Text fontSize="xl" fontWeight="bold">
                    <FormatCurrency value={totalAmount} />
                  </Text>
                </Flex>
                <Divider />
              </Box>
            )}
            <Flex justify="flex-end">
              {items.length > 0 && (
                <>
                  <Link href="/checkout" passHref>
                    <Button as="a" colorScheme="blue" mr={3} onClick={onClose}>
                      ir a comparar
                    </Button>
                  </Link>
                  <Button colorScheme="red" mr={3} onClick={clearCart}>
                    Clear Cart
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </Flex>
          </Box>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ShoppingCart;
