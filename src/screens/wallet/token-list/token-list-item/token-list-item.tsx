import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { TokenContainer, TokenPreviewProps } from '../../../../components/token-container/token-container';
import { EmptyFn } from '../../../../config/general';
import { formatAssetAmount } from '../../../../utils/number.util';
import { useTokenListItemStyles } from './token-list-item.styles';

interface Props extends TokenPreviewProps {
  balance: string;
  onPress: EmptyFn;
  exchangeRate?: string | number;
  address?: string;
}

export const TokenListItem: FC<Props> = ({ symbol, name, iconName, apy, balance, onPress, exchangeRate }) => {
  const styles = useTokenListItemStyles();
  const formattedBalance = formatAssetAmount(new BigNumber(balance));
  const formattedDollarEquivalent = formatAssetAmount(
    new BigNumber(Number(formattedBalance) * Number(exchangeRate)),
    BigNumber.ROUND_DOWN,
    2
  );

  return (
    <TouchableOpacity onPress={onPress}>
      <TokenContainer symbol={symbol} name={name} iconName={iconName} apy={apy}>
        <View style={styles.rightContainer}>
          <Text style={styles.balanceText}>{formattedBalance}</Text>
          {formattedDollarEquivalent !== 'NaN' && <Text style={styles.valueText}>{formattedDollarEquivalent} $</Text>}
        </View>
      </TokenContainer>
    </TouchableOpacity>
  );
};
