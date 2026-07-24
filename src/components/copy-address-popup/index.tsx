import React, { memo, Ref, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';

import { Account } from 'src/interfaces/account.interfaces';
import { useSaplingAddressForAccount } from 'src/store/sapling/sapling-selectors.ts';
import { formatSize } from 'src/styles/format-size';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy.ts';

import { CryptoLogo } from '../crypto-logo';
import { CryptoLogoNameEnum } from '../crypto-logo/logo-name.enum';
import { SafeTouchableOpacity } from '../safe-touchable-opacity';
import { TruncatedText } from '../truncated-text';

import { useCopyAddressPopupStyles } from './styles';

export interface CopyAddressPopupController {
  open: EmptyFn;
  close: EmptyFn;
}

interface CopyAddressOption {
  label: string;
  address: string;
  iconName: CryptoLogoNameEnum;
}

interface Props {
  controlRef: Ref<CopyAddressPopupController>;
  account: Account;
}

export const CopyAddressPopup = memo<Props>(({ controlRef, account }) => {
  const [isVisible, setIsVisible] = useState(false);

  const styles = useCopyAddressPopupStyles();
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

  const onClose = useCallback(() => setIsVisible(false), []);

  useImperativeHandle(
    controlRef,
    () => ({
      open: () => setIsVisible(true),
      close: onClose
    }),
    [onClose]
  );

  const handleOptionPress = (address: string) => {
    copyStringToClipboard(address);
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <Text style={styles.title}>Copy address</Text>

              {options.map(({ label, address, iconName }) => (
                <React.Fragment key={label}>
                  <SafeTouchableOpacity style={styles.option} onPress={() => handleOptionPress(address)}>
                    <View style={styles.optionInfo}>
                      <Text style={styles.optionLabel}>{label}</Text>
                      <TruncatedText ellipsizeMode="middle" style={styles.optionAddress}>
                        {address}
                      </TruncatedText>
                    </View>

                    <View style={styles.iconContainer}>
                      <CryptoLogo name={iconName} size={formatSize(20)} />
                    </View>
                  </SafeTouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});
