import React, { FC, useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { isAndroid, EMPTY_PUBLIC_KEY_HASH } from 'src/config/system';
import { useDomainName } from 'src/hooks/use-domain-name.hook';
import { toggleDomainAddressShown } from 'src/store/settings/settings-actions';
import { useIsShownDomainNameSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { isString } from 'src/utils/is-string';

import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { PublicKeyHashText } from '../public-key-hash-text/public-key-hash-text';
import { TouchableWithAnalytics } from '../touchable-with-analytics';

import { WalletAddressSelectors } from './selectors';
import { useWalletAddressStyles } from './wallet-address.styles';

interface Props {
  publicKeyHash: string;
  isLocalDomainNameShowing?: boolean;
  disabled?: boolean;
  isPublicKeyHashTextDisabled?: boolean;
}

export const WalletAddress: FC<Props> = ({
  publicKeyHash,
  isLocalDomainNameShowing = false,
  disabled,
  isPublicKeyHashTextDisabled
}) => {
  const [isDomainNameShownLocal, setIsDomainNameShownLocal] = useState(true);
  const styles = useWalletAddressStyles();
  const dispatch = useDispatch();
  const isDomainNameShownGlobal = useIsShownDomainNameSelector();
  const isShownDomainName = isLocalDomainNameShowing ? isDomainNameShownLocal : isDomainNameShownGlobal;
  const domainName = useDomainName(publicKeyHash);

  if (publicKeyHash === EMPTY_PUBLIC_KEY_HASH) {
    return null;
  }

  const handleDomainAddressToggle = () => {
    if (isLocalDomainNameShowing) {
      setIsDomainNameShownLocal(prev => !prev);
    } else {
      dispatch(toggleDomainAddressShown());
    }
  };

  return (
    <View style={styles.pkhWrapper}>
      {isShownDomainName && isString(domainName) ? (
        <TouchableWithAnalytics
          Component={TouchableOpacity}
          style={styles.domainNameContainer}
          {...(isAndroid && { disallowInterruption: true })}
          disabled={disabled}
          testID={WalletAddressSelectors.addressOrDomain}
          testIDProperties={{ isDomain: true }}
          shouldTrackLongPress={true}
          shouldTrackShortPress={false}
          onLongPress={() => copyStringToClipboard(domainName)}
        >
          <Text style={styles.domainNameText}>{domainName}</Text>
        </TouchableWithAnalytics>
      ) : (
        <PublicKeyHashText
          longPress
          publicKeyHash={publicKeyHash}
          disabled={isPublicKeyHashTextDisabled}
          testID={WalletAddressSelectors.addressOrDomain}
          testIDProperties={{ isDomain: false }}
        />
      )}
      {isString(domainName) ? (
        <TouchableIcon
          size={formatSize(16)}
          style={styles.iconContainer}
          name={isShownDomainName ? IconNameEnum.Diez : IconNameEnum.Globe}
          testID={WalletAddressSelectors.domainSwitcher}
          onPress={handleDomainAddressToggle}
        />
      ) : null}
    </View>
  );
};
