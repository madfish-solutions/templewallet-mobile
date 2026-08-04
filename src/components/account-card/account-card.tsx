import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { DropdownItemContainer } from 'src/components/dropdown/dropdown-item-container/dropdown-item-container';
import { FormattedAmount } from 'src/components/formatted-amount';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { NetworkLogo } from 'src/components/network-logo/network-logo';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { getSeedFromAccount } from 'src/components/robot-icon/robot-icon.utils';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useTotalFiatBalanceOfAccount } from 'src/hooks/use-total-balance';
import { Account } from 'src/interfaces/account.interfaces';
import { useSaplingAddressForAccount } from 'src/store/sapling/sapling-selectors';
import { formatSize } from 'src/styles/format-size';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';

import { useAccountCardStyles } from './account-card.styles';

interface CommonProps {
  chainKind: TempleChainKind;
  isShieldedTez?: boolean;
  showDropdownDown?: boolean;
  showBalance?: boolean;
}

interface AccountProps extends CommonProps {
  variant?: 'account';
  account: Account;
}

interface ContactProps extends CommonProps {
  variant: 'contact';
  name: string;
  address: string;
  avatarSeed: string;
}

type Props = AccountProps | ContactProps;

export const AccountCard: FC<Props> = props => {
  const styles = useAccountCardStyles();

  return (
    <DropdownItemContainer style={styles.card}>
      <AccountSummary {...props} />
    </DropdownItemContainer>
  );
};

export const AccountSummary: FC<Props> = props => {
  const { chainKind, isShieldedTez = false, showDropdownDown = false, showBalance = true } = props;
  const styles = useAccountCardStyles();
  const isContact = props.variant === 'contact';
  const saplingAddress = useSaplingAddressForAccount(isContact ? undefined : props.account);
  const address = isContact
    ? props.address
    : isShieldedTez
    ? saplingAddress
    : chainKind === TempleChainKind.Tezos
    ? getAccountAddressForTezos(props.account)
    : getAccountAddressForEvm(props.account);
  const logoName = isShieldedTez
    ? CryptoLogoNameEnum.ShieldedTezos
    : chainKind === TempleChainKind.Tezos
    ? CryptoLogoNameEnum.Tezos
    : CryptoLogoNameEnum.Etherlink;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RobotIcon seed={isContact ? props.avatarSeed : getSeedFromAccount(props.account)} size={formatSize(24)} />
        <Text numberOfLines={1} style={styles.name}>
          {isContact ? props.name : props.account.name}
        </Text>
        {showBalance && !isContact && (
          <View style={styles.headerTrailingContent}>
            <AccountBalance account={props.account} />
          </View>
        )}
        {showDropdownDown && <IconV2 name={IconNameV2Enum.DropdownDown} size={12} />}
      </View>
      {!!address && (
        <View style={styles.addressRow}>
          <View style={styles.address}>
            <NetworkLogo name={logoName} />
            <Text style={styles.addressText}>{truncateAddress(address)}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

interface AccountBalanceProps {
  account: Account;
}

const AccountBalance: FC<AccountBalanceProps> = ({ account }) => {
  const totalFiatBalance = useTotalFiatBalanceOfAccount(account);
  const styles = useAccountCardStyles();

  return (
    <HideBalance textStyle={styles.balance}>
      <FormattedAmount amount={totalFiatBalance} isDollarValue />
    </HideBalance>
  );
};

const truncateAddress = (address: string) =>
  address.length > 10 ? `${address.slice(0, 2)}...${address.slice(-4)}` : address;
