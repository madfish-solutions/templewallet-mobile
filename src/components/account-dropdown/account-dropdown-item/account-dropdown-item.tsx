import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { EMPTY_PUBLIC_KEY_HASH } from '../../../config/system';
import { emptyWalletAccount, WalletAccountInterface } from '../../../interfaces/wallet-account.interface';
import { formatSize } from '../../../styles/format-size';
import { conditionalStyle } from '../../../utils/conditional-style';
import { isDefined } from '../../../utils/is-defined';
import { getTruncatedProps } from '../../../utils/style.util';
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

export const AccountDropdownItem: FC<AccountDropdownItemProps> = ({
  account = emptyWalletAccount,
  showFullData = true,
  actionIconName
}) => {
  const styles = useAccountDropdownItemStyles();
  const { publicKeyHash, name } = account;

  return (
    <View style={styles.root}>
      <RobotIcon seed={publicKeyHash} />
      <View style={styles.infoContainer}>
        <View style={[styles.upperContainer, conditionalStyle(showFullData, styles.upperContainerFullData)]}>
          <Text {...getTruncatedProps(styles.name)}>{name}</Text>
          {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
        </View>
        <View style={styles.lowerContainer}>
          {publicKeyHash !== EMPTY_PUBLIC_KEY_HASH && <WalletAddress publicKeyHash={publicKeyHash} />}
          {showFullData && (
            <HideBalance style={styles.balanceText}>
              <AssetValueText
                asset={getTezosToken(account?.tezosBalance.data)}
                amount={getTezosToken(account?.tezosBalance.data).balance}
              />
            </HideBalance>
          )}
        </View>
      </View>
    </View>
  );
};

export const renderAccountListItem: DropdownListItemComponent<WalletAccountInterface> = ({ item, isSelected }) => (
  <AccountDropdownItem account={item} {...(isSelected && { actionIconName: IconNameEnum.Check })} />
);
