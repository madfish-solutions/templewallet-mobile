import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { FormattedAmount } from 'src/components/formatted-amount';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { NetworkLogo } from 'src/components/network-logo/network-logo';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { getSeedFromAccount } from 'src/components/robot-icon/robot-icon.utils';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { FormSectionDropdown } from 'src/form/form-section-dropdown';
import { useTotalFiatBalanceOfAccount } from 'src/hooks/use-total-balance';
import { Account } from 'src/interfaces/account.interfaces';
import { SectionDropdownDataInterface } from 'src/interfaces/section-dropdown-data.interface';
import { SendReceiver } from 'src/interfaces/send-receiver.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { useSaplingAddressForAccount } from 'src/store/sapling/sapling-selectors';
import { useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';

import { DropdownListItemComponent, DropdownValueComponent } from '../dropdown/dropdown';
import { DropdownItemContainer } from '../dropdown/dropdown-item-container/dropdown-item-container';

import { contactEqualityFn } from './contact-equality-fn.ts';
import { useContactFormSectionDropdownStyles } from './contact-form-section-dropdown.styles';

interface Props extends TestIdProps {
  name: string;
  list: Array<SectionDropdownDataInterface<SendReceiver>>;
  setSearchValue: SyncFn<string>;
  chainKind: TempleChainKind;
  isShieldedTez?: boolean;
}

const truncateAddress = (address?: string) =>
  address && address.length > 12 ? `${address.slice(0, 6)}...${address.slice(-6)}` : address;

export const ContactFormSectionDropdown: FC<Props> = ({
  name,
  list,
  setSearchValue,
  chainKind,
  isShieldedTez = false,
  testID,
  testIDProperties
}) => {
  const styles = useContactFormSectionDropdownStyles();
  const logoName = isShieldedTez
    ? CryptoLogoNameEnum.ShieldedTezos
    : chainKind === TempleChainKind.Tezos
    ? CryptoLogoNameEnum.Tezos
    : CryptoLogoNameEnum.Etherlink;

  const renderContactValue: DropdownValueComponent<SendReceiver> = ({ value }) =>
    value ? (
      <ReceiverRow
        receiver={value}
        logoName={logoName}
        chainKind={chainKind}
        isShieldedTez={isShieldedTez}
        showDropdownDown
        withCard
      />
    ) : null;
  const renderContactListItem: DropdownListItemComponent<SendReceiver> = ({ item }) => (
    <ReceiverRow receiver={item} logoName={logoName} chainKind={chainKind} isShieldedTez={isShieldedTez} />
  );

  return (
    <FormSectionDropdown
      isSearchable
      name={name}
      list={list}
      description="My Accounts"
      setSearchValue={setSearchValue}
      equalityFn={contactEqualityFn}
      renderValue={renderContactValue}
      renderListItem={renderContactListItem}
      itemContainerStyle={styles.listAccountContainer}
      showCloseButton
      testID={testID}
      testIDProperties={testIDProperties}
    />
  );
};

interface ReceiverRowProps {
  receiver: SendReceiver;
  logoName: CryptoLogoNameEnum;
  chainKind: TempleChainKind;
  isShieldedTez: boolean;
  showDropdownDown?: boolean;
  withCard?: boolean;
}

const ReceiverRow: FC<ReceiverRowProps> = ({
  receiver,
  logoName,
  chainKind,
  isShieldedTez,
  showDropdownDown = false,
  withCard = false
}) => {
  const accounts = useAllAccounts();
  const account = accounts.find(item => item.id === receiver.accountId);

  return account ? (
    withCard ? (
      <AccountCard
        account={account}
        chainKind={chainKind}
        isShieldedTez={isShieldedTez}
        showDropdownDown={showDropdownDown}
      />
    ) : (
      <AccountReceiverRow
        account={account}
        chainKind={chainKind}
        isShieldedTez={isShieldedTez}
        showDropdownDown={showDropdownDown}
      />
    )
  ) : (
    <ReceiverRowLayout receiver={receiver} logoName={logoName} chainKind={chainKind} isShieldedTez={isShieldedTez} />
  );
};

interface AccountCardProps {
  account: Account;
  chainKind: TempleChainKind;
  isShieldedTez?: boolean;
  showDropdownDown?: boolean;
}

export const AccountCard: FC<AccountCardProps> = ({
  account,
  chainKind,
  isShieldedTez = false,
  showDropdownDown = false
}) => {
  const styles = useContactFormSectionDropdownStyles();

  return (
    <DropdownItemContainer style={styles.selectedAccountContainer}>
      <AccountReceiverRow
        account={account}
        chainKind={chainKind}
        isShieldedTez={isShieldedTez}
        showDropdownDown={showDropdownDown}
      />
    </DropdownItemContainer>
  );
};

const AccountReceiverRow: FC<AccountCardProps> = ({
  account,
  chainKind,
  isShieldedTez = false,
  showDropdownDown = false
}) => {
  const totalFiatBalance = useTotalFiatBalanceOfAccount(account);
  const saplingAddress = useSaplingAddressForAccount(account);
  const styles = useContactFormSectionDropdownStyles();
  const address = isShieldedTez
    ? saplingAddress
    : chainKind === TempleChainKind.Tezos
    ? getAccountAddressForTezos(account)
    : getAccountAddressForEvm(account);
  const logoName = isShieldedTez
    ? CryptoLogoNameEnum.ShieldedTezos
    : chainKind === TempleChainKind.Tezos
    ? CryptoLogoNameEnum.Tezos
    : CryptoLogoNameEnum.Etherlink;

  return (
    <View style={styles.accountContainer}>
      <View style={styles.accountHeader}>
        <RobotIcon seed={getSeedFromAccount(account)} size={formatSize(24)} />
        <Text numberOfLines={1} style={styles.accountName}>
          {account.name}
        </Text>
        <View style={styles.accountHeaderTrailingContent}>
          <HideBalance textStyle={styles.accountBalance}>
            <FormattedAmount amount={totalFiatBalance} isDollarValue />
          </HideBalance>
          {showDropdownDown && <IconV2 name={IconNameV2Enum.DropdownDown} size={12} />}
        </View>
      </View>
      {!!address && (
        <View style={styles.accountAddressRow}>
          <View style={styles.accountAddress}>
            <NetworkLogo name={logoName} />
            <Text style={styles.accountAddressText}>{truncateAccountAddress(address)}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const truncateAccountAddress = (address: string) =>
  address.length > 10 ? `${address.slice(0, 2)}...${address.slice(-4)}` : address;

const ReceiverRowLayout: FC<ReceiverRowProps & { balance?: React.ReactNode }> = ({ receiver, logoName, balance }) => {
  const styles = useContactFormSectionDropdownStyles();

  return (
    <View style={styles.contactContainer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{receiver.name.slice(0, 1).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text numberOfLines={1} style={styles.name}>
            {receiver.name}
          </Text>
          {!!balance && <HideBalance textStyle={styles.balance}>{balance}</HideBalance>}
        </View>
        {!!receiver.address && (
          <View style={styles.addressRow}>
            <CryptoLogo name={logoName} size={formatSize(14)} internalSize={formatSize(14)} />
            <Text style={styles.address}>{truncateAddress(receiver.address)}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
