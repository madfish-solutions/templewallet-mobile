import React, { FC } from 'react';
import { View, Text } from 'react-native';

interface Props {
  spender: string;
  symbol: string;
}

export const Approve: FC<Props> = ({ spender, symbol }) => {
  return (
    <View>
      <Text>Approve</Text>
      <Text>To: {spender}</Text>
      <Text>{symbol}</Text>
    </View>
  );
};
