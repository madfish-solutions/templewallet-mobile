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
}

export const TokenEquityValue: FC<Props> = ({ balance, symbol }) => {
  const styles = useTokenEquityValueStyles();

  const formattedBalance = formatAssetAmount(new BigNumber(balance));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name={IconNameEnum.EyeOpenBold} size={formatSize(24)} />
        <Text style={styles.dateText}>Equity Value {currentDate}</Text>
      </View>
      <Text style={styles.tokenValueText}>
        {formattedBalance} {symbol}
      </Text>
      <Text style={styles.equityValueText}>≈ XX XXX.XX $</Text>
    </View>
  );
};
