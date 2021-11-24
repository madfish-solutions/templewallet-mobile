import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { isAndroid } from '../../config/system';
import { useReadOnlyTezosToolkit } from '../../hooks/use-read-only-tezos-toolkit.hook';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { copyStringToClipboard } from '../../utils/clipboard.utils';
import { tezosDomainsResolver } from '../../utils/dns.utils';
import { isString } from '../../utils/is-string';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { PublicKeyHashText } from '../public-key-hash-text/public-key-hash-text';
import { useWalletAddressStyles } from './wallet-address.styles';
interface Props {
  publicKeyHash: string;
  noCopy?: boolean;
}

export const WalletAddress: FC<Props> = ({ publicKeyHash, noCopy }) => {
  const styles = useWalletAddressStyles();
  const [domainName, setDomainName] = useState('');
  const [isShownDomainName, setIsShownDomainName] = useState(false);
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
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
          {...(isAndroid && { disallowInterruption: true })}
          onPress={() => (noCopy === true ? 0 : copyStringToClipboard(domainName))}
        >
          <Text style={styles.domainNameText}>{domainName}</Text>
        </TouchableOpacity>
      ) : (
        <PublicKeyHashText noCopy={noCopy} publicKeyHash={publicKeyHash} />
      )}
      {isString(domainName) ? (
        <TouchableIcon
          size={formatSize(16)}
          style={styles.iconContainer}
          name={isShownDomainName ? IconNameEnum.Diez : IconNameEnum.Globe}
          onPress={() => setIsShownDomainName(!isShownDomainName)}
        />
      ) : null}
    </View>
  );
};
