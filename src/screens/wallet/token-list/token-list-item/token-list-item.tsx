import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { TokenContainer, TokenPreviewProps } from '../../../../components/token-container/token-container';
import { EmptyFn } from '../../../../config/general';
import { useTokenListItemStyles } from './token-list-item.styles';

interface Props extends TokenPreviewProps {
  balance: string;
  onPress: EmptyFn;
}

export const TokenListItem: FC<Props> = ({ symbol, name, iconName, apy, balance, onPress }) => {
  const styles = useTokenListItemStyles();

  return (
    <TouchableOpacity onPress={onPress}>
      <TokenContainer symbol={symbol} name={name} iconName={iconName} apy={apy}>
        <View style={styles.rightContainer}>
          <Text style={styles.balanceText}>{balance}</Text>
          <Text style={styles.valueText}>X XXX.XX $</Text>
        </View>
      </TokenContainer>
    </TouchableOpacity>
  );
};
