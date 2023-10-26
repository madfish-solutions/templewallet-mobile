import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { WalletSelectors } from 'src/screens/wallet/wallet.selectors';

import { useHideBalance } from '../../hooks/hide-balance/hide-balance.hook';
import { useNetworkInfo } from '../../hooks/use-network-info.hook';
import { useTotalBalance } from '../../hooks/use-total-balance';
import { formatSize } from '../../styles/format-size';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { AssetEquityText } from '../asset-equity-text/asset-equity-text';
import { AssetValueText } from '../asset-value-text/asset-value-text';
import { Divider } from '../divider/divider';
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

  const { isTezosNode } = useNetworkInfo();

  const { toggleHideBalance, isBalanceHidden } = useHideBalance();
  const totalBalance = useTotalBalance();

  return isTezosNode ? (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableIcon
          name={isBalanceHidden ? IconNameEnum.EyeClosedBold : IconNameEnum.EyeOpenBold}
          size={formatSize(24)}
          onPress={toggleHideBalance}
          testID={WalletSelectors.tokenEquityButton}
        />
        {showTokenValue ? (
          <View style={styles.equityContainer}>
            <Text style={styles.dateText}>Equity Value {currentDate}</Text>
            <AssetEquityText style={styles.dateText} asset={token} />
          </View>
        ) : (
          <Text style={styles.dateText}>Equity Value {currentDate}</Text>
        )}
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
          <AssetValueText convertToDollar asset={totalBalance} amount={totalBalance.balance} />
        </HideBalance>
      )}
    </View>
  ) : (
    <Divider />
  );
};
