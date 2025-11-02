import { Input } from '@chakra-ui/input';
import { Button, Flex, FormControl, FormLabel, Text } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

export const QuantitySelector = ({ onChange, initialValue = 1 }) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(initialValue);

  const handleDecrement = () => {
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);
    onChange(newQuantity);
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onChange(newQuantity);
  };

  const handleChange = e => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      setQuantity(newQuantity);
      onChange(newQuantity);
    }
  };

  return (
    <FormControl>
      <Text
        as={FormLabel}
        variant="small"
        fontWeight="600"
        letterSpacing="0.1rem"
        textTransform="uppercase">
        {t('product.quantity')}
      </Text>
      <Flex flexDirection="row" mt={2} alignItems="center">
        <Button onClick={handleDecrement} size="md" height="100%">
          -
        </Button>
        <Input
          width={16}
          min={1}
          textAlign="center"
          type="number"
          value={quantity}
          onChange={handleChange}
          size="md"
        />
        <Button onClick={handleIncrement} size="md" height="100%">
          +
        </Button>
      </Flex>
    </FormControl>
  );
};
