import React, { FC, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { copyStringToClipboard } from '../../utils/clipboard.utils';
import { tezosDomainsResolver } from '../../utils/dns.utils';
import { isDefined } from '../../utils/is-defined';
import { isString } from '../../utils/is-string';
import { createReadOnlyTezosToolkit } from '../../utils/network/tezos-toolkit.utils';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { PublicKeyHashText } from '../public-key-hash-text/public-key-hash-text';
import { useWalletAddressStyles } from './wallet-address.styles';

interface Props {
  publicKeyHash: string;
}

export const WalletAddress: FC<Props> = ({ publicKeyHash }) => {
  const styles = useWalletAddressStyles();
  const [domainName, setDomainName] = useState('');
  const [isShownDomainName, setIsShownDomainName] = useState(false);
  const selectedAccount = useSelectedAccountSelector();
  const tezos = createReadOnlyTezosToolkit(selectedAccount);
  const resolver = tezosDomainsResolver(tezos);

  const updateDomainReverseName = async (pkh: string) => {
    setDomainName((await resolver.resolveAddressToName(pkh)) ?? '');
  };

  useEffect(() => {
    setIsShownDomainName(false);
    updateDomainReverseName(publicKeyHash);
  }, [publicKeyHash]);

  return (
    <View style={styles.pkhWrapper}>
      {isShownDomainName ? (
        <TouchableOpacity
          style={styles.domainNameContainer}
          onPress={e => {
            e.stopPropagation();
            copyStringToClipboard(domainName);
          }}
        >
          <Text style={styles.domainNameText}>{domainName}</Text>
        </TouchableOpacity>
      ) : (
        <PublicKeyHashText publicKeyHash={publicKeyHash} />
      )}
      {isString(domainName) ? (
        <TouchableIcon
          size={formatSize(16)}
          style={styles.iconContainer}
          name={isShownDomainName ? IconNameEnum.Diez : IconNameEnum.Globe}
          onPress={e => {
            if (isDefined(e)) {
              e.stopPropagation();
            }
            setIsShownDomainName(!isShownDomainName);
          }}
        />
      ) : null}
    </View>
  );
};
