import React, { FC, ReactNode } from 'react';
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { DropdownItemContainer } from 'src/components/dropdown/dropdown-item-container/dropdown-item-container';
import { getSeedFromAccount } from 'src/components/robot-icon/robot-icon.utils';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { Account } from 'src/interfaces/account.interfaces';
import { useSaplingAddressForAccount } from 'src/store/sapling/sapling-selectors';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';
import { isDefined } from 'src/utils/is-defined';

import { AccountDetails } from './account-details';
import { useAccountCardStyles } from './styles';

interface CommonProps {
  isShieldedTez?: boolean;
  showDropdownDown?: boolean;
  showBalance?: boolean;
  showAllAddresses?: boolean;
  fixedBalanceWidth?: boolean;
  footer?: ReactNode;
  detailsContainerStyle?: StyleProp<ViewStyle>;
}

interface AccountProps extends CommonProps {
  variant?: 'account';
  account: Account;
  chainKind?: TempleChainKind;
  onAddressPress?: (address: string, event?: GestureResponderEvent) => void;
}

interface ContactProps extends CommonProps {
  variant: 'contact';
  chainKind: TempleChainKind;
  name: string;
  address: string;
  avatarSeed: string;
}

type Props = AccountProps | ContactProps;

export const AccountCard: FC<Props> = props => {
  const styles = useAccountCardStyles();

  return (
    <DropdownItemContainer style={[styles.card, isDefined(props.footer) && styles.cardWithFooter]}>
      <AccountSummary {...props} />
      {props.footer}
    </DropdownItemContainer>
  );
};

export const AccountSummary: FC<Props> = props => {
  const {
    chainKind = TempleChainKind.Tezos,
    isShieldedTez = false,
    showDropdownDown = false,
    showBalance = true,
    showAllAddresses = false,
    fixedBalanceWidth = true,
    detailsContainerStyle
  } = props;
  const isContact = props.variant === 'contact';
  const saplingAddress = useSaplingAddressForAccount(isContact ? undefined : props.account);
  const tezosAddress = isContact ? undefined : getAccountAddressForTezos(props.account);
  const evmAddress = isContact ? undefined : getAccountAddressForEvm(props.account);
  const selectedAddress = isContact
    ? props.address
    : isShieldedTez
    ? saplingAddress
    : chainKind === TempleChainKind.Tezos
    ? tezosAddress
    : evmAddress;
  const logoName = isShieldedTez
    ? CryptoLogoNameEnum.ShieldedTezos
    : chainKind === TempleChainKind.Tezos
    ? CryptoLogoNameEnum.Tezos
    : CryptoLogoNameEnum.Etherlink;
  const addresses = showAllAddresses
    ? [
        tezosAddress ? { address: tezosAddress, network: CryptoLogoNameEnum.Tezos } : undefined,
        saplingAddress ? { address: saplingAddress, network: CryptoLogoNameEnum.ShieldedTezos } : undefined,
        evmAddress ? { address: evmAddress, network: CryptoLogoNameEnum.Etherlink } : undefined
      ]
        .filter(isDefined)
        .map(addressDetails => ({
          ...addressDetails,
          onPress:
            !isContact && props.onAddressPress
              ? (event?: GestureResponderEvent) => props.onAddressPress?.(addressDetails.address, event)
              : undefined
        }))
    : selectedAddress
    ? [{ address: selectedAddress, network: logoName }]
    : [];

  return (
    <AccountDetails
      account={isContact ? undefined : props.account}
      avatarSeed={isContact ? props.avatarSeed : getSeedFromAccount(props.account)}
      name={isContact ? props.name : props.account.name}
      addresses={addresses}
      showBalance={showBalance && !isContact}
      showDropdownDown={showDropdownDown}
      addressIconVariant={showAllAddresses ? 'compactTransparent' : undefined}
      compactAddresses={showAllAddresses}
      fixedBalanceWidth={fixedBalanceWidth}
      containerStyle={detailsContainerStyle}
    />
  );
};
