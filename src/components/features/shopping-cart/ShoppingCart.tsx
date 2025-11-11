
import { Box, Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Heading, Text, VStack, Image, HStack } from '@chakra-ui/react';
import Link from 'next/link';

import { FormatCurrency } from '@src/components/shared/format-currency';
import { QuantitySelector } from '@src/components/shared/quantity-selector';
import { useCart } from '@src/context/CartProvider';

const ShoppingCart = ({ isOpen, onClose }) => {
  const { items, clearCart, updateItemQuantity, removeItem, totalAmount } = useCart();

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Shopping Cart</DrawerHeader>
        <DrawerBody>
          {items.length === 0 ? (
            <Flex h="full" align="center" justify="center">
              <Text>Your cart is empty.</Text>
            </Flex>
          ) : (
            <VStack spacing={5} divider={<Divider />}>
              {items.map(item => (
                <HStack key={item.id} w="full" spacing={4} align="start">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      boxSize="80px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  )}
                  <VStack align="start" spacing={1} flex={1}>
                    <Heading as="h4" size="sm" noOfLines={2}>{item.name}</Heading>
                    <Text fontSize="md" color="gray.600"><FormatCurrency value={item.price} /></Text>
                    <QuantitySelector
                      initialValue={item.quantity}
                      onChange={newQuantity => updateItemQuantity(item.id, newQuantity)}
                    />
                  </VStack>
                  <Button
                    variant="ghost"
                    colorScheme="red"
                    size="sm"
                    onClick={() => removeItem(item.id)} 
                  >
                    &times;
                  </Button>
                </HStack>
              ))}
            </VStack>
          )}
        </DrawerBody>

        {items.length > 0 && (
            <DrawerFooter borderTopWidth="1px">
                <VStack spacing={4} w="full">
                    <HStack justify="space-between" w="full">
                        <Text fontSize="xl" fontWeight="bold">Total:</Text>
                        <Text fontSize="xl" fontWeight="bold"><FormatCurrency value={totalAmount} /></Text>
                    </HStack>
                    <HStack w="full">
                        <Button variant="outline" mr={3} onClick={clearCart} w="full">Clear Cart</Button>
                        <Link href="/checkout" passHref style={{ width: '100%' }}>
                            <Button as="a" colorScheme="blue" onClick={onClose} w="full">
                                Go to Checkout
                            </Button>
                        </Link>
                    </HStack>
                </VStack>
            </DrawerFooter>
        )}

      </DrawerContent>
    </Drawer>
  );
};

export default ShoppingCart;
