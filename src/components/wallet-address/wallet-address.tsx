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
  disabled?: boolean;
}

export const WalletAddress: FC<Props> = ({ publicKeyHash, disabled }) => {
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

  const shownName = isShownDomainName ? IconNameEnum.Diez : IconNameEnum.Globe;

  return (
    <View style={styles.pkhWrapper}>
      {isShownDomainName ? (
        <TouchableOpacity
          style={styles.domainNameContainer}
          {...(isAndroid && { disallowInterruption: true })}
          disabled={disabled}
          onPress={() => copyStringToClipboard(domainName)}
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
          name={shownName}
          onPress={() => setIsShownDomainName(!isShownDomainName)}
        />
      ) : null}
    </View>
  );
};
