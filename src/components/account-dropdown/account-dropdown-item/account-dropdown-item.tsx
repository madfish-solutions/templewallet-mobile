import React, { FC, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { emptyWalletAccount, WalletAccountInterface } from '../../../interfaces/wallet-account.interface';
import { useSelectedAccountSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { conditionalStyle } from '../../../utils/conditional-style';
import { isTezosDomainsSupported } from '../../../utils/dns.utils';
import { isDefined } from '../../../utils/is-defined';
import { createReadOnlyTezosToolkit } from '../../../utils/network/tezos-toolkit.utils';
import { getTruncatedProps } from '../../../utils/style.util';
import { getTezosToken } from '../../../utils/wallet.utils';
import { DropdownListItemComponent } from '../../dropdown/dropdown';
import { HideBalance } from '../../hide-balance/hide-balance';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { PublicKeyHashText } from '../../public-key-hash-text/public-key-hash-text';
import { RobotIcon } from '../../robot-icon/robot-icon';
import { TokenValueText } from '../../token-value-text/token-value-text';
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
  const [domainName, setDomainName] = useState('');
  const selectedAccount = useSelectedAccountSelector();
  const tezos = createReadOnlyTezosToolkit(selectedAccount);
  const { resolver: domainsResolver, isSupported } = isTezosDomainsSupported(tezos);

  const updateDomainReverseName = async (pkh: string) => {
    setDomainName((await domainsResolver.resolveAddressToName(pkh)) ?? '');
  };

  useEffect(() => {
    updateDomainReverseName(account.publicKeyHash);
  }, [account.publicKeyHash]);

  return (
    <View style={styles.root}>
      <RobotIcon seed={account.publicKeyHash} />
      <View style={styles.infoContainer}>
        <View style={[styles.upperContainer, conditionalStyle(showFullData, styles.upperContainerFullData)]}>
          <Text {...getTruncatedProps(styles.name)}>{account.name}</Text>
          {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
        </View>
        <View style={styles.lowerContainer}>
          <View style={styles.pkhWrapper}>
            <PublicKeyHashText publicKeyHash={account.publicKeyHash} />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={e => {
                e.stopPropagation();
                console.log('test');
              }}>
              <Icon name={IconNameEnum.Diez} />
            </TouchableOpacity>
          </View>
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
