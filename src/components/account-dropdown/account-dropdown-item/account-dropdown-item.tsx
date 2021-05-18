import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AccountInterface } from '../../../interfaces/account.interface';
import { emptyWalletAccount } from '../../../interfaces/wallet-account.interface';
import { formatSize } from '../../../styles/format-size';
import { conditionalStyle } from '../../../utils/conditional-style';
import { isDefined } from '../../../utils/is-defined';
import { DropdownListItemComponent } from '../../dropdown/dropdown';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { useAccountDropdownItemStyles } from './account-dropdown-item.styles';

interface Props {
  account?: AccountInterface;
  showFullData?: boolean;
  actionIconName?: IconNameEnum;
}

export const AccountDropdownItem: FC<Props> = ({
  account = emptyWalletAccount,
  showFullData = true,
  actionIconName
}) => {
  const styles = useAccountDropdownItemStyles();

  return (
    <View style={styles.root}>
      <View style={styles.icon} />
      <View style={styles.infoContainer}>
        <View style={[styles.upperContainer, conditionalStyle(showFullData, styles.upperContainerFullData)]}>
          <Text style={styles.name}>{account.name}</Text>
          {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
        </View>
        <View style={styles.lowerContainer}>
          <Text style={styles.publicKeyHash} numberOfLines={1} ellipsizeMode="middle">
            {account.publicKeyHash}
          </Text>

          {showFullData && <Text style={styles.balanceText}>XX XXX.XX XTZ</Text>}
        </View>
      </View>
    </View>
  );
};

export const renderAccountListItem: DropdownListItemComponent<AccountInterface> = ({ item, isSelected }) => (
  <AccountDropdownItem account={item} {...(isSelected && { actionIconName: IconNameEnum.Check })} />
);
