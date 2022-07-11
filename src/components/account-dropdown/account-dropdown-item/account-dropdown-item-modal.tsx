import React, { FC } from 'react';
import { View } from 'react-native';

import { emptyAccount } from '../../../interfaces/account.interface';
import { useTezosTokenSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { isDefined } from '../../../utils/is-defined';
import { AssetValueText } from '../../asset-value-text/asset-value-text';
import { HideBalance } from '../../hide-balance/hide-balance';
import { Icon } from '../../icon/icon';
import { RobotIcon } from '../../robot-icon/robot-icon';
import { WalletAddress } from '../../wallet-address/wallet-address';
import { AccountDropdownItemProps } from './account-dropdown-item.interface';
import { useAccountDropdownItemStyles } from './account-dropdown-item.styles';

export const AccountDropdownModalItem: FC<AccountDropdownItemProps> = ({
  account = emptyAccount,
  showFullData = true,
  actionIconName
}) => {
  const styles = useAccountDropdownItemStyles();
  const tezosToken = useTezosTokenSelector(account.publicKeyHash);

  return (
    <View style={styles.root}>
      <RobotIcon size={formatSize(24)} seed={account.publicKeyHash} />
      <View style={styles.smallInfoContainer}>
        <View style={styles.lowerContainer}>
          <WalletAddress disabled={true} publicKeyHash={account.publicKeyHash} />
          {showFullData && (
            <HideBalance style={styles.balanceText}>
              <AssetValueText asset={tezosToken} amount={tezosToken.balance} />
            </HideBalance>
          )}
          {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
        </View>
      </View>
    </View>
  );
};
