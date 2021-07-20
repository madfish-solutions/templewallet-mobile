import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { TokenContainer } from '../../../../components/token-container/token-container';
import { TokenContainerProps } from '../../../../components/token-container/token-container.props';
import { EmptyFn } from '../../../../config/general';
import { formatAssetAmount } from '../../../../utils/number.util';
import { useTokenListItemStyles } from './token-list-item.styles';

interface Props extends TokenContainerProps {
  onPress: EmptyFn;
  exchangeRate?: string | number;
}

export const TokenListItem: FC<Props> = ({ token, apy, onPress, exchangeRate }) => {
  const styles = useTokenListItemStyles();

  const formattedBalance = formatAssetAmount(new BigNumber(token.balance));
  const formattedDollarEquivalent = formatAssetAmount(
    new BigNumber(Number(formattedBalance) * Number(exchangeRate)),
    BigNumber.ROUND_DOWN,
    2
  );

  return (
    <TouchableOpacity onPress={onPress}>
      <TokenContainer token={token} apy={apy}>
        <View style={styles.rightContainer}>
          <Text style={styles.balanceText}>{formattedBalance}</Text>
          {formattedDollarEquivalent !== 'NaN' && <Text style={styles.valueText}>{formattedDollarEquivalent} $</Text>}
        </View>
      </TokenContainer>
    </TouchableOpacity>
  );
};
