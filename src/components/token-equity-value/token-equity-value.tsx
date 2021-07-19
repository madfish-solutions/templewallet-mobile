import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { formatAssetAmount } from '../../utils/number.util';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useTokenEquityValueStyles } from './token-equity-value.styles';

const currentDate = new Date().toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

interface Props {
  balance: string;
  symbol: string;
  exchangeRate: number;
}

export const TokenEquityValue: FC<Props> = ({ balance, symbol, exchangeRate }) => {
  const styles = useTokenEquityValueStyles();

  const formattedBalance = formatAssetAmount(new BigNumber(balance));
  const formattedDollarEquivalent = formatAssetAmount(
    new BigNumber(Number(balance) * exchangeRate),
    BigNumber.ROUND_DOWN,
    2
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name={IconNameEnum.EyeOpenBold} size={formatSize(24)} />
        <Text style={styles.dateText}>Equity Value {currentDate}</Text>
      </View>
      <Text style={styles.tokenValueText}>
        {formattedBalance} {symbol}
      </Text>
      {formattedDollarEquivalent !== 'NaN' && (
        <Text style={styles.equityValueText}>≈ {formattedDollarEquivalent} $</Text>
      )}
    </View>
  );
};
