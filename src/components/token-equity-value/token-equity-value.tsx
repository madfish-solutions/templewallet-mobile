import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { useHideBalance } from '../../hooks/hide-balance/hide-balance.hook';
import { formatSize } from '../../styles/format-size';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { DollarValueText } from '../dollar-value-text/dollar-value-text';
import { HideBalance } from '../hide-balance/hide-balance';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { TokenValueText } from '../token-value-text/token-value-text';
import { useTokenEquityValueStyles } from './token-equity-value.styles';

const currentDate = new Date().toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

interface Props {
  token: TokenInterface;
}

export const TokenEquityValue: FC<Props> = ({ token }) => {
  const styles = useTokenEquityValueStyles();

  const { toggleHideBalance, isBalanceHidden } = useHideBalance();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableIcon
          name={isBalanceHidden ? IconNameEnum.EyeClosedBold : IconNameEnum.EyeOpenBold}
          size={formatSize(24)}
          onPress={toggleHideBalance}
        />
        <Text style={styles.dateText}>Equity Value {currentDate}</Text>
      </View>
      <HideBalance style={styles.tokenValueText}>
        <TokenValueText token={token} />
      </HideBalance>
      <HideBalance style={styles.equityValueText}>
        <DollarValueText token={token} />
      </HideBalance>
    </View>
  );
};
