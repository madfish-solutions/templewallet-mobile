import React, { FC } from 'react';
import { GestureResponderEvent, StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { FormattedAmount } from 'src/components/formatted-amount';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { NetworkIcon, NetworkIconVariant } from 'src/components/network-icon';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { useTotalFiatBalanceOfAccount } from 'src/hooks/use-total-balance';
import { Account } from 'src/interfaces/account.interfaces';
import { formatSize } from 'src/styles/format-size';
import { truncateAccountAddress } from 'src/utils/account.utils';

import { useAccountCardStyles } from './styles';

interface AccountAddressDetails {
  address: string;
  network: CryptoLogoNameEnum;
  onPress?: (event?: GestureResponderEvent) => void;
}

interface AccountDetailsProps {
  account?: Account;
  avatarSeed: string;
  name: string;
  addresses: AccountAddressDetails[];
  showBalance?: boolean;
  showDropdownDown?: boolean;
  addressIconVariant?: NetworkIconVariant;
  compactAddresses?: boolean;
  fixedBalanceWidth?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  balanceContainerStyle?: StyleProp<ViewStyle>;
  balanceTextStyle?: StyleProp<TextStyle>;
}

export const AccountDetails: FC<AccountDetailsProps> = ({
  account,
  avatarSeed,
  name,
  addresses,
  showBalance = true,
  showDropdownDown = false,
  addressIconVariant,
  compactAddresses = false,
  fixedBalanceWidth = true,
  containerStyle,
  balanceContainerStyle,
  balanceTextStyle
}) => {
  const styles = useAccountCardStyles();

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <RobotIcon seed={avatarSeed} size={formatSize(24)} />
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        {showBalance && account && (
          <View
            style={[
              styles.headerTrailingContent,
              fixedBalanceWidth && styles.headerTrailingContentFixed,
              balanceContainerStyle
            ]}
          >
            <AccountBalance account={account} textStyle={balanceTextStyle} alignRight={fixedBalanceWidth} />
          </View>
        )}
        {showDropdownDown && <IconV2 name={IconNameV2Enum.DropdownDown} size={12} />}
      </View>
      {addresses.length > 0 && (
        <View style={styles.addressRow}>
          {addresses.map(({ address, network, onPress }) => (
            <AccountAddress
              key={`${network}-${address}`}
              address={address}
              network={network}
              onPress={onPress}
              iconVariant={addressIconVariant}
              compact={compactAddresses}
            />
          ))}
        </View>
      )}
    </View>
  );
};

interface AccountAddressProps extends AccountAddressDetails {
  iconVariant?: NetworkIconVariant;
  compact: boolean;
}

const AccountAddress: FC<AccountAddressProps> = ({ address, network, onPress, iconVariant, compact }) => {
  const styles = useAccountCardStyles();
  const content = (
    <>
      <NetworkIcon name={network} variant={iconVariant} />
      <Text style={[styles.addressText, compact && styles.compactAddressText]}>{truncateAccountAddress(address)}</Text>
    </>
  );

  return onPress ? (
    <TouchableOpacity style={[styles.address, compact && styles.compactAddress]} onPress={onPress}>
      {content}
    </TouchableOpacity>
  ) : (
    <View style={[styles.address, compact && styles.compactAddress]}>{content}</View>
  );
};

interface AccountBalanceProps {
  account: Account;
  textStyle?: StyleProp<TextStyle>;
  alignRight: boolean;
}

const AccountBalance: FC<AccountBalanceProps> = ({ account, textStyle, alignRight }) => {
  const totalFiatBalance = useTotalFiatBalanceOfAccount(account);
  const styles = useAccountCardStyles();

  return (
    <HideBalance textStyle={[styles.balance, alignRight && styles.balanceRight, textStyle]}>
      <FormattedAmount amount={totalFiatBalance} isDollarValue />
    </HideBalance>
  );
};
