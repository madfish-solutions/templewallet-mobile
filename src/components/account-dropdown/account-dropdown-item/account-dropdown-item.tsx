import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { emptyWalletAccount, WalletAccountInterface } from '../../../interfaces/wallet-account.interface';
import { formatSize } from '../../../styles/format-size';
import { conditionalStyle } from '../../../utils/conditional-style';
import { isDefined } from '../../../utils/is-defined';
import { getTruncatedProps } from '../../../utils/style.util';
import { getTezosToken } from '../../../utils/wallet.utils';
import { DropdownListItemComponent } from '../../dropdown/dropdown';
import { HideBalance } from '../../hide-balance/hide-balance';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { RobotIcon } from '../../robot-icon/robot-icon';
import { TokenValueText } from '../../token-value-text/token-value-text';
import { WalletAddress } from '../../wallet-address/wallet-address';
import { useAccountDropdownItemStyles } from './account-dropdown-item.styles';

interface Props {
  account?: WalletAccountInterface;
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
      <RobotIcon seed={account.publicKeyHash} />
      <View style={styles.infoContainer}>
        <View style={[styles.upperContainer, conditionalStyle(showFullData, styles.upperContainerFullData)]}>
          <Text {...getTruncatedProps(styles.name)}>{account.name}</Text>
          {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
        </View>
        <View style={styles.lowerContainer}>
          <WalletAddress publicKeyHash={account.publicKeyHash} />
          {showFullData && (
            <HideBalance style={styles.balanceText}>
              <TokenValueText
                token={getTezosToken(account?.tezosBalance.data)}
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
