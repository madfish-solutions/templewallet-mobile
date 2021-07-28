import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { generateHitSlop } from '../../styles/generate-hit-slop';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { useHideBalance } from '../../utils/hide-balance/hide-balance.hook';
import { formatAssetAmount } from '../../utils/number.util';
import { DollarEquivalentText } from '../dollar-equivalent-text/dollar-equivalent-text';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { TokenEquivalentText } from '../token-equivalent-text/token-equivalent-text';
import { useTokenEquityValueStyles } from './token-equity-value.styles';

const currentDate = new Date().toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

interface Props {
  token: TokenInterface;
  exchangeRate: number;
}

export const TokenEquityValue: FC<Props> = ({ token, exchangeRate }) => {
  const styles = useTokenEquityValueStyles();

  const { hideBalanceHandler, isBalanceHidden } = useHideBalance();

  const formattedBalance = formatAssetAmount(new BigNumber(token.balance));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableIcon
          onPress={hideBalanceHandler}
          name={isBalanceHidden ? IconNameEnum.EyeClosedBold : IconNameEnum.EyeOpenBold}
          size={formatSize(24)}
        />
        <Text style={styles.dateText}>Equity Value {currentDate}</Text>
      </View>
      <TokenEquivalentText style={styles.tokenValueText}>
        {formattedBalance} {token.symbol}
      </TokenEquivalentText>
      <DollarEquivalentText balance={formattedBalance} exchangeRate={exchangeRate} style={styles.equityValueText} />
    </View>
  );
};
