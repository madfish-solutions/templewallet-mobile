import React, { FC } from 'react';
import { View } from 'react-native';

import { emptyWalletAccount, WalletAccountInterface } from '../../../interfaces/wallet-account.interface';
import { formatSize } from '../../../styles/format-size';
import { isDefined } from '../../../utils/is-defined';
import { getTezosToken } from '../../../utils/wallet.utils';
import { AssetValueText } from '../../asset-value-text/asset-value-text';
import { DropdownListItemComponent } from '../../dropdown/dropdown';
import { HideBalance } from '../../hide-balance/hide-balance';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { RobotIcon } from '../../robot-icon/robot-icon';
import { WalletAddress } from '../../wallet-address/wallet-address';
import { AccountDropdownItemProps } from './account-dropdown-item.interface';
import { useAccountDropdownItemStyles } from './account-dropdown-item.styles';

export const AccountDropdownModalItem: FC<AccountDropdownItemProps> = ({
  account = emptyWalletAccount,
  showFullData = true,
  actionIconName
}) => {
  const styles = useAccountDropdownItemStyles();

  return (
    <View style={styles.root}>
      <RobotIcon seed={account.publicKeyHash} />
      <View style={styles.smallInfoContainer}>
        <View style={styles.lowerContainer}>
          <WalletAddress disabled={true} publicKeyHash={account.publicKeyHash} />
          {showFullData && (
            <HideBalance style={styles.balanceText}>
              <AssetValueText
                asset={getTezosToken(account?.tezosBalance.data)}
                amount={getTezosToken(account?.tezosBalance.data).balance}
              />
            </HideBalance>
          )}
          {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
        </View>
      </View>
    </View>
  );
};

export const renderModalAccountListItem: DropdownListItemComponent<WalletAccountInterface> = ({ item, isSelected }) => (
  <AccountDropdownModalItem account={item} {...(isSelected && { actionIconName: IconNameEnum.Check })} />
);
