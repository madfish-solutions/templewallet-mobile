import React, { FC, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { AccountBaseInterface, emptyAccountBase } from '../../../interfaces/account.interface';
import { useSelectedRpcUrlSelector } from '../../../store/settings/settings-selectors';
import { formatSize } from '../../../styles/format-size';
import { TEZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
import { conditionalStyle } from '../../../utils/conditional-style';
import { isDefined } from '../../../utils/is-defined';
import { readOnlySignerAccount } from '../../../utils/read-only.signer.util';
import { createReadOnlyTezosToolkit } from '../../../utils/rpc/tezos-toolkit.utils';
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
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const [tezosBalance, setTezosBalance] = useState('0');

  useEffect(() => {
    void createReadOnlyTezosToolkit(selectedRpcUrl, readOnlySignerAccount)
      .tz.getBalance(account.publicKeyHash)
      .then(value => setTezosBalance(value.toFixed()));
  }, []);

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
            publicKeyHash={account.publicKeyHash}
            isPublicKeyHashTextDisabled={isPublicKeyHashTextDisabled}
          />
          {showFullData && (
            <HideBalance style={styles.balanceText}>
              <AssetValueText asset={TEZ_TOKEN_METADATA} amount={tezosBalance} />
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
