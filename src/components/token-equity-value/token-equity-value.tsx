import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { TokenInterface } from '../../token/interfaces/token.interface';
import { formatAssetAmount } from '../../utils/number.util';
import { useTokenEquityValueStyles } from './token-equity-value.styles';

const currentDate = new Date().toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

interface Props {
  token: TokenInterface;
}

export const TokenEquityValue: FC<Props> = ({ token }) => {
  const styles = useTokenEquityValueStyles();

  const formattedBalance = formatAssetAmount(new BigNumber(token.balance));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>Equity Value {currentDate}</Text>
      </View>
      <Text style={styles.tokenValueText}>
        {formattedBalance} {token.symbol}
      </Text>
    </View>
  );
};
