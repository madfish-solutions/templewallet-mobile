import React, { FC, ReactNode } from 'react';
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

import { DropdownItemContainer } from 'src/components/dropdown/dropdown-item-container/dropdown-item-container';
import { getSeedFromAccount } from 'src/components/robot-icon/robot-icon.utils';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { Account } from 'src/interfaces/account.interfaces';
import { isDefined } from 'src/utils/is-defined';

import { AccountDetails } from './account-details';
import { useAccountCardStyles } from './styles';
import { useAccountAddressDetails } from './use-account-address-details.hook';

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
  const addresses = useAccountAddressDetails({
    account: isContact ? undefined : props.account,
    contactAddress: isContact ? props.address : undefined,
    chainKind,
    isShieldedTez,
    showAllAddresses,
    onAddressPress: isContact ? undefined : props.onAddressPress
  });

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
