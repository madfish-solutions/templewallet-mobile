import React, { memo, useCallback, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Account } from 'src/interfaces/account.interfaces';
import { useSaplingAddressForAccount } from 'src/store/sapling/sapling-selectors.ts';
import { formatSize } from 'src/styles/format-size';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy.ts';

import { CryptoLogo } from '../crypto-logo';
import { CryptoLogoNameEnum } from '../crypto-logo/logo-name.enum';
import { OptionsPopupHOC, OptionsPopupProps } from '../options-popup';
import { TruncatedText } from '../truncated-text';

import { useCopyAddressPopupStyles } from './styles';

interface CopyAddressOption {
  label: string;
  address: string;
  iconName: CryptoLogoNameEnum;
}

interface Props extends Pick<OptionsPopupProps<CopyAddressOption>, 'controlRef' | 'triggerRef'> {
  account: Account;
}

const CopyAddressPopupBase = OptionsPopupHOC<CopyAddressOption>(({ option }) => {
  const styles = useCopyAddressPopupStyles();
  const { label, address, iconName } = option;

  return (
    <View style={styles.option}>
      <View style={styles.optionInfo}>
        <Text style={styles.optionLabel}>{label}</Text>
        <TruncatedText ellipsizeMode="middle" style={styles.optionAddress}>
          {address}
        </TruncatedText>
      </View>

      <View style={styles.iconContainer}>
        <CryptoLogo name={iconName} size={formatSize(20)} />
      </View>
    </View>
  );
});

const optionKeyFn = (option: CopyAddressOption) => option.label;

export const CopyAddressPopup = memo<Props>(({ controlRef, account, triggerRef }) => {
  const saplingAddress = useSaplingAddressForAccount(account);

  const options = useMemo<CopyAddressOption[]>(() => {
    const tezosAddress = getAccountAddressForTezos(account);
    const evmAddress = getAccountAddressForEvm(account);

    return [
      isDefined(tezosAddress) && {
        label: 'Tezos',
        address: tezosAddress,
        iconName: CryptoLogoNameEnum.Tezos
      },
      isDefined(saplingAddress) && {
        label: 'Shielded',
        address: saplingAddress,
        iconName: CryptoLogoNameEnum.ShieldedTezos
      },
      isDefined(evmAddress) && {
        label: 'Etherlink',
        address: evmAddress,
        iconName: CryptoLogoNameEnum.Etherlink
      }
    ].filter(isTruthy);
  }, [account, saplingAddress]);

  const onOptionPress = useCallback(({ address }: CopyAddressOption) => {
    copyStringToClipboard(address);
    controlRef.current?.close();
  }, []);

  return (
    <CopyAddressPopupBase
      controlRef={controlRef}
      title="Copy address"
      options={options}
      keyFn={optionKeyFn}
      placement="bottom-left"
      onOptionPress={onOptionPress}
      yOffset={formatSize(8)}
      triggerRef={triggerRef}
    />
  );
});
