import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { isAndroid, EMPTY_PUBLIC_KEY_HASH } from 'src/config/system';
import { useDomainName } from 'src/hooks/use-domain-name.hook';
import { toggleDomainAddressShown } from 'src/store/settings/settings-actions';
import { useIsShownDomainNameSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { isString } from 'src/utils/is-string';

import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { PublicKeyHashText } from '../public-key-hash-text/public-key-hash-text';
import { WalletAddressSelectors } from './selectors';
import { useWalletAddressStyles } from './wallet-address.styles';

interface Props {
  publicKeyHash: string;
  disabled?: boolean;
  isPublicKeyHashTextDisabled?: boolean;
}

export const WalletAddress: FC<Props> = ({ publicKeyHash, disabled, isPublicKeyHashTextDisabled }) => {
  const styles = useWalletAddressStyles();
  const dispatch = useDispatch();
  const isShownDomainName = useIsShownDomainNameSelector();
  const domainName = useDomainName(publicKeyHash);
  const { trackEvent } = useAnalytics();

  if (publicKeyHash === EMPTY_PUBLIC_KEY_HASH) {
    return null;
  }

  return (
    <View style={styles.pkhWrapper}>
      {isShownDomainName && isString(domainName) ? (
        <TouchableOpacity
          style={styles.domainNameContainer}
          {...(isAndroid && { disallowInterruption: true })}
          disabled={disabled}
          testID={WalletAddressSelectors.addressOrDomain}
          onLongPress={() => {
            trackEvent(WalletAddressSelectors.addressOrDomain, AnalyticsEventCategory.ButtonPress, { isDomain: true });
            copyStringToClipboard(domainName);
          }}
        >
          <Text style={styles.domainNameText}>{domainName}</Text>
        </TouchableOpacity>
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
          onPress={() => dispatch(toggleDomainAddressShown())}
        />
      ) : null}
    </View>
  );
};
