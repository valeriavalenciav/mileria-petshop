import { Input } from '@chakra-ui/input';
import { Flex, FormControl, FormLabel, Text } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';

export const QuantitySelector = ({ onChange }) => {
  const { t } = useTranslation();

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
      <Flex flexDirection="row" mt={2}>
        <Input
          width={16}
          min={1}
          textAlign="center"
          type="number"
          defaultValue="1"
          onChange={e => onChange(parseInt(e.target.value))}
        />
      </Flex>
    </FormControl>
  );
};
