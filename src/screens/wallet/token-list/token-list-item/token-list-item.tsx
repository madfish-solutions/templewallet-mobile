import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { View } from 'react-native';

import { DollarValueText } from '../../../../components/dollar-value-text/dollar-value-text';
import { HideBalance } from '../../../../components/hide-balance/hide-balance';
import { TokenContainer } from '../../../../components/token-container/token-container';
import { TokenContainerProps } from '../../../../components/token-container/token-container.props';
import { TokenValueText } from '../../../../components/token-value-text/token-value-text';
import { EmptyFn } from '../../../../config/general';
import { useTokenListItemStyles } from './token-list-item.styles';

interface Props extends TokenContainerProps {
  onPress: EmptyFn;
  exchangeRate: number;
}

export const TokenListItem: FC<Props> = ({ token, apy, onPress, exchangeRate }) => {
  const styles = useTokenListItemStyles();

  return (
    <TouchableOpacity onPress={onPress}>
      <TokenContainer token={token} apy={apy}>
        <View style={styles.rightContainer}>
          <HideBalance style={styles.balanceText}>
            <TokenValueText>{token.balance}</TokenValueText>
          </HideBalance>
          <HideBalance style={styles.valueText}>
            <DollarValueText exchangeRate={exchangeRate}>{token.balance}</DollarValueText>
          </HideBalance>
        </View>
      </TokenContainer>
    </TouchableOpacity>
  );
};
