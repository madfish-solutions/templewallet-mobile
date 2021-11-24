import React, { FC } from 'react';
import { Text, View } from 'react-native';

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
import { useAccountDropdownItemStyles } from './account-dropdown-item.styles';

interface Props {
  account?: WalletAccountInterface;
  showFullData?: boolean;
  actionIconName?: IconNameEnum;
  isModal?: boolean;
}

export const AccountDropdownItem: FC<Props> = ({
  account = emptyWalletAccount,
  showFullData = true,
  actionIconName,
  isModal
}) => {
  const styles = useAccountDropdownItemStyles();

  const infoContainerStyle = isModal === true ? styles.smallInfoContainer : styles.infoContainer;

  return (
    <View style={styles.root}>
      <RobotIcon seed={account.publicKeyHash} />
      <View style={infoContainerStyle}>
        {isModal !== true && (
          <View style={[styles.upperContainer, conditionalStyle(showFullData, styles.upperContainerFullData)]}>
            <Text {...getTruncatedProps(styles.name)}>{account.name}</Text>
            {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
          </View>
        )}
        <View style={styles.lowerContainer}>
          <WalletAddress noCopy={isModal} publicKeyHash={account.publicKeyHash} />
          {showFullData && (
            <HideBalance style={styles.balanceText}>
              <AssetValueText
                asset={getTezosToken(account?.tezosBalance.data)}
                amount={getTezosToken(account?.tezosBalance.data).balance}
              />
            </HideBalance>
          )}
          {isDefined(actionIconName) && isModal === true && <Icon name={actionIconName} size={formatSize(24)} />}
        </View>
      </View>
    </View>
  );
};

export const renderAccountListItem: DropdownListItemComponent<WalletAccountInterface> = ({ item, isSelected }) => (
  <AccountDropdownItem account={item} {...(isSelected && { actionIconName: IconNameEnum.Check })} />
);
