import memoize from 'mem';
import React, { FC, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { isTezosDomainsSupported } from '../../utils/dns.utils';
import { isString } from '../../utils/is-string';
import { createReadOnlyTezosToolkit } from '../../utils/network/tezos-toolkit.utils';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { PublicKeyHashText } from '../public-key-hash-text/public-key-hash-text';
import { useWalletAddressStyles } from './wallet-address.styles';
import { formatSize } from '../../styles/format-size';

interface Props {
  publicKeyHash: string;
}

export const WalletAddress: FC<Props> = ({ publicKeyHash }) => {
  const styles = useWalletAddressStyles();
  const [domainName, setDomainName] = useState('');
  const [isShownDomainName, setIsShownDomainName] = useState(false);
  const selectedAccount = useSelectedAccountSelector();
  const tezos = createReadOnlyTezosToolkit(selectedAccount);
  const { resolver: domainsResolver } = isTezosDomainsSupported(tezos);

  const updateDomainReverseName = async (pkh: string) => {
    const memoizedDomainName = memoize(
      async () => {
        return await domainsResolver.resolveAddressToName(pkh);
      },
      {
        cacheKey: () => pkh
      }
    );
    setDomainName((await memoizedDomainName()) ?? '');
  };

  useEffect(() => {
    setIsShownDomainName(false);
    updateDomainReverseName(publicKeyHash);
  }, [publicKeyHash]);

  return (
    <View style={styles.pkhWrapper}>
      {isShownDomainName ? (
        <View style={styles.domainNameContainer}>
          <Text style={styles.domainNameText}>{domainName}</Text>
        </View>
      ) : (
        <PublicKeyHashText publicKeyHash={publicKeyHash} />
      )}
      {isString(domainName) ? (
        <TouchableIcon
          size={formatSize(16)}
          style={styles.iconContainer}
          name={isShownDomainName ? IconNameEnum.Diez : IconNameEnum.Globe}
          onPress={e => {
            e.stopPropagation();
            setIsShownDomainName(!isShownDomainName);
          }}
        />
      ) : null}
    </View>
  );
};
