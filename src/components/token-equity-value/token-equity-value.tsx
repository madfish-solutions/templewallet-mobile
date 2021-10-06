import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { useHideBalance } from '../../hooks/hide-balance/hide-balance.hook';
import { useTotalBalance } from '../../hooks/use-total-balance';
import { formatSize } from '../../styles/format-size';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { AssetValueText } from '../asset-value-text/asset-value-text';
import { HideBalance } from '../hide-balance/hide-balance';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { useTokenEquityValueStyles } from './token-equity-value.styles';

const currentDate = new Date().toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

interface Props {
  token: TokenInterface;
  showTokenValue?: boolean;
}

export const TokenEquityValue: FC<Props> = ({ token, showTokenValue = true }) => {
  const styles = useTokenEquityValueStyles();

  const { toggleHideBalance, isBalanceHidden } = useHideBalance();
  const { summaryAsset, totalBalance } = useTotalBalance();

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
      {showTokenValue ? (
        <>
          <HideBalance style={styles.mainValueText}>
            <AssetValueText asset={token} amount={token.balance} />
          </HideBalance>
          <HideBalance style={styles.additionalValueText}>
            <AssetValueText convertToDollar asset={token} amount={token.balance} />
          </HideBalance>
        </>
      ) : (
        <HideBalance style={styles.mainValueText}>
          <AssetValueText convertToDollar asset={summaryAsset} amount={totalBalance.toFixed()} />
        </HideBalance>
      )}
    </View>
  );
};
