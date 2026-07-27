import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { FormattedAmount } from 'src/components/formatted-amount';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { getSeedFromAccount } from 'src/components/robot-icon/robot-icon.utils';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { FormSectionDropdown } from 'src/form/form-section-dropdown';
import { useTotalFiatBalanceOfAccount } from 'src/hooks/use-total-balance';
import { SectionDropdownDataInterface } from 'src/interfaces/section-dropdown-data.interface';
import { SendReceiver } from 'src/interfaces/send-receiver.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { useSaplingAddressForAccount } from 'src/store/sapling/sapling-selectors';
import { useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';
import { isDefined } from 'src/utils/is-defined';

import { DropdownListItemComponent, DropdownValueComponent } from '../dropdown/dropdown';
import { DropdownItemContainer } from '../dropdown/dropdown-item-container/dropdown-item-container';

import { contactEqualityFn } from './contact-equality-fn.ts';
import { useContactFormSectionDropdownStyles } from './contact-form-section-dropdown.styles';

interface Props extends TestIdProps {
  name: string;
  list: Array<SectionDropdownDataInterface<SendReceiver>>;
  setSearchValue: SyncFn<string>;
  chainKind: TempleChainKind;
}

const truncateAddress = (address?: string) =>
  address && address.length > 12 ? `${address.slice(0, 6)}...${address.slice(-6)}` : address;

export const ContactFormSectionDropdown: FC<Props> = ({
  name,
  list,
  setSearchValue,
  chainKind,
  testID,
  testIDProperties
}) => {
  const logoName = chainKind === TempleChainKind.Tezos ? CryptoLogoNameEnum.Tezos : CryptoLogoNameEnum.Etherlink;

  const renderContactValue: DropdownValueComponent<SendReceiver> = ({ value }) =>
    value ? (
      <DropdownItemContainer>
        <ReceiverRow receiver={value} logoName={logoName} showDropdownDown />
      </DropdownItemContainer>
    ) : null;
  const renderContactListItem: DropdownListItemComponent<SendReceiver> = ({ item }) => (
    <ReceiverRow receiver={item} logoName={logoName} />
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
      showCancelButton={false}
      showCloseButton
      testID={testID}
      testIDProperties={testIDProperties}
    />
  );
};

interface ReceiverRowProps {
  receiver: SendReceiver;
  logoName: CryptoLogoNameEnum;
  showDropdownDown?: boolean;
}

const ReceiverRow: FC<ReceiverRowProps> = ({ receiver, logoName, showDropdownDown = false }) => {
  const accounts = useAllAccounts();
  const account = accounts.find(item => item.id === receiver.accountId);

  return account ? (
    <AccountReceiverRow account={account} showDropdownDown={showDropdownDown} />
  ) : (
    <ReceiverRowLayout receiver={receiver} logoName={logoName} />
  );
};

const AccountReceiverRow: FC<{
  account: ReturnType<typeof useAllAccounts>[number];
  showDropdownDown?: boolean;
}> = ({ account, showDropdownDown = false }) => {
  const totalFiatBalance = useTotalFiatBalanceOfAccount(account);
  const saplingAddress = useSaplingAddressForAccount(account);
  const styles = useContactFormSectionDropdownStyles();
  const tezosAddress = getAccountAddressForTezos(account);
  const evmAddress = getAccountAddressForEvm(account);
  const addresses = [
    tezosAddress ? { address: tezosAddress, logoName: CryptoLogoNameEnum.Tezos } : undefined,
    saplingAddress ? { address: saplingAddress, logoName: CryptoLogoNameEnum.ShieldedTezos } : undefined,
    evmAddress ? { address: evmAddress, logoName: CryptoLogoNameEnum.Etherlink } : undefined
  ].filter(isDefined);

  return (
    <View style={styles.accountContainer}>
      <View style={styles.accountHeader}>
        <RobotIcon seed={getSeedFromAccount(account)} size={formatSize(24)} padding={formatSize(2)} />
        <Text numberOfLines={1} style={styles.accountName}>
          {account.name}
        </Text>
        <HideBalance style={styles.accountBalance}>
          <FormattedAmount amount={totalFiatBalance} isDollarValue />
        </HideBalance>
        {showDropdownDown && <IconV2 name={IconNameV2Enum.DropdownDown} size={12} />}
      </View>
      <View style={styles.accountAddressRow}>
        {addresses.map(({ address, logoName: addressLogoName }) => (
          <View key={address} style={styles.accountAddress}>
            <CryptoLogo name={addressLogoName} size={formatSize(16)} internalSize={formatSize(12)} />
            <Text style={styles.accountAddressText}>{truncateAccountAddress(address)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const truncateAccountAddress = (address: string) =>
  address.length > 10 ? `${address.slice(0, 3)}...${address.slice(-4)}` : address;

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
          {!!balance && <HideBalance style={styles.balance}>{balance}</HideBalance>}
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
