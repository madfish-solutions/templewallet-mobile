import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { View } from 'react-native';

import { DollarValueText } from '../../../../components/dollar-value-text/dollar-value-text';
import { HideBalance } from '../../../../components/hide-balance/hide-balance';
import { TokenContainer } from '../../../../components/token-container/token-container';
import { TokenContainerProps } from '../../../../components/token-container/token-container.props';
import { TokenValueText } from '../../../../components/token-value-text/token-value-text';
import { EmptyFn } from '../../../../config/general';
import { useTokenExchangeRate } from '../../../../hooks/use-token-exchange-rate.hook';
import { useTokenListItemStyles } from './token-list-item.styles';

interface Props extends TokenContainerProps {
  onPress: EmptyFn;
}

export const TokenListItem: FC<Props> = ({ token, apy, onPress }) => {
  const styles = useTokenListItemStyles();
  const exchangeRate = useTokenExchangeRate(token);

  return (
    <TouchableOpacity onPress={onPress}>
      <TokenContainer token={token} apy={apy}>
        <View style={styles.rightContainer}>
          <HideBalance style={styles.balanceText}>
            <TokenValueText token={token} isShowSymbol={false} />
          </HideBalance>
          <HideBalance style={styles.valueText}>
            <DollarValueText token={token} />
          </HideBalance>
        </View>
      </TokenContainer>
    </TouchableOpacity>
  );
};
