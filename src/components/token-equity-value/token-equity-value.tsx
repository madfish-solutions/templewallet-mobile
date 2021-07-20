import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { formatAssetAmount } from '../../utils/number.util';
import { DollarEquivalentText } from '../dollar-equivalent-text/dollar-equivalent-text';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useTokenEquityValueStyles } from './token-equity-value.styles';

const currentDate = new Date().toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

interface Props {
  token: TokenInterface;
  exchangeRate: number;
}

export const TokenEquityValue: FC<Props> = ({ token, exchangeRate }) => {
  const styles = useTokenEquityValueStyles();

  const formattedBalance = formatAssetAmount(new BigNumber(token.balance));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name={IconNameEnum.EyeOpenBold} size={formatSize(24)} />
        <Text style={styles.dateText}>Equity Value {currentDate}</Text>
      </View>
      <Text style={styles.tokenValueText}>
        {formattedBalance} {token.symbol}
      </Text>
      <DollarEquivalentText balance={formattedBalance} exchangeRate={exchangeRate} style={styles.equityValueText} />
    </View>
  );
};
