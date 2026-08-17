import React, { FC } from 'react';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { DropdownItemContainer } from 'src/components/dropdown/dropdown-item-container/dropdown-item-container';
import { getSeedFromAccount } from 'src/components/robot-icon/robot-icon.utils';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { Account } from 'src/interfaces/account.interfaces';
import { useSaplingAddressForAccount } from 'src/store/sapling/sapling-selectors';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';

import { AccountDetails } from './account-details';
import { useAccountCardStyles } from './styles';

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
    <AccountDetails
      account={isContact ? undefined : props.account}
      avatarSeed={isContact ? props.avatarSeed : getSeedFromAccount(props.account)}
      name={isContact ? props.name : props.account.name}
      addresses={address ? [{ address, network: logoName }] : []}
      showBalance={showBalance && !isContact}
      showDropdownDown={showDropdownDown}
    />
  );
};
