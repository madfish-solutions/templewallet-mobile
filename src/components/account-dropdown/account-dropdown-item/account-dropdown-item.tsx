import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { useNetworkInfo } from 'src/hooks/use-network-info.hook';

import { AccountBaseInterface, emptyAccountBase } from '../../../interfaces/account.interface';
import { useTezosTokenSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { conditionalStyle } from '../../../utils/conditional-style';
import { isDefined } from '../../../utils/is-defined';
import { getTruncatedProps } from '../../../utils/style.util';
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
  account = emptyAccountBase,
  showFullData = true,
  actionIconName,
  isPublicKeyHashTextDisabled
}) => {
  const styles = useAccountDropdownItemStyles();
  const tezos = useTezosTokenSelector(account.publicKeyHash);
  const { metadata } = useNetworkInfo();

  return (
    <View style={styles.root}>
      <RobotIcon seed={account.publicKeyHash} />
      <View style={styles.infoContainer}>
        <View style={[styles.upperContainer, conditionalStyle(showFullData, styles.upperContainerFullData)]}>
          <Text {...getTruncatedProps(styles.name)}>{account.name}</Text>
          {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
        </View>
        <View style={styles.lowerContainer}>
          <WalletAddress
            isLocalDomainNameShowing
            publicKeyHash={account.publicKeyHash}
            isPublicKeyHashTextDisabled={isPublicKeyHashTextDisabled}
          />
          {showFullData && (
            <HideBalance style={styles.balanceText}>
              <AssetValueText asset={metadata} amount={tezos.balance} />
            </HideBalance>
          )}
        </View>
      </View>
    </View>
  );
};

export const renderAccountListItem: DropdownListItemComponent<AccountBaseInterface> = ({ item, isSelected }) => (
  <AccountDropdownItem account={item} {...(isSelected && { actionIconName: IconNameEnum.Check })} />
);
