import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { isAndroid, EMPTY_PUBLIC_KEY_HASH } from '../../config/system';
import { useDomainName } from '../../hooks/use-domain-name.hook';
import { TestIdProps } from '../../interfaces/test-id.props';
import { toggleDomainAddressShown } from '../../store/settings/settings-actions';
import { useIsShownDomainNameSelector } from '../../store/settings/settings-selectors';
import { formatSize } from '../../styles/format-size';
import { copyStringToClipboard } from '../../utils/clipboard.utils';
import { isString } from '../../utils/is-string';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { PublicKeyHashText } from '../public-key-hash-text/public-key-hash-text';
import { useWalletAddressStyles } from './wallet-address.styles';

interface Props extends TestIdProps {
  publicKeyHash: string;
  disabled?: boolean;
  isPublicKeyHashTextDisabled?: boolean;
}

export const WalletAddress: FC<Props> = ({ publicKeyHash, disabled, isPublicKeyHashTextDisabled }) => {
  const styles = useWalletAddressStyles();
  const dispatch = useDispatch();
  const isShownDomainName = useIsShownDomainNameSelector();
  const domainName = useDomainName(publicKeyHash);

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
          onLongPress={() => copyStringToClipboard(domainName)}
        >
          <Text style={styles.domainNameText}>{domainName}</Text>
        </TouchableOpacity>
      ) : (
        <PublicKeyHashText longPress publicKeyHash={publicKeyHash} disabled={isPublicKeyHashTextDisabled} />
      )}
      {isString(domainName) ? (
        <TouchableIcon
          size={formatSize(16)}
          style={styles.iconContainer}
          name={isShownDomainName ? IconNameEnum.Diez : IconNameEnum.Globe}
          onPress={() => dispatch(toggleDomainAddressShown())}
        />
      ) : null}
    </View>
  );
};
