import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { View } from 'react-native';

import { BalanceText } from '../../../../components/balance-text/balance-text';
import { TokenContainer } from '../../../../components/token-container/token-container';
import { TokenContainerProps } from '../../../../components/token-container/token-container.props';
import { EmptyFn } from '../../../../config/general';
import { formatAssetAmount } from '../../../../utils/number.util';
import { useTokenListItemStyles } from './token-list-item.styles';

interface Props extends TokenContainerProps {
  onPress: EmptyFn;
  exchangeRate: number;
}

export const TokenListItem: FC<Props> = ({ token, apy, onPress, exchangeRate }) => {
  const styles = useTokenListItemStyles();

  const formattedBalance = formatAssetAmount(new BigNumber(token.balance));

  return (
    <TouchableOpacity onPress={onPress}>
      <TokenContainer token={token} apy={apy}>
        <View style={styles.rightContainer}>
          <BalanceText style={styles.balanceText}>{formattedBalance}</BalanceText>
          <BalanceText exchangeRate={exchangeRate} style={styles.valueText}>
            {formattedBalance}
          </BalanceText>
        </View>
      </TokenContainer>
    </TouchableOpacity>
  );
};
