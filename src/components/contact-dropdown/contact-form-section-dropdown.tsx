import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { FormattedAmount } from 'src/components/formatted-amount';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { FormSectionDropdown } from 'src/form/form-section-dropdown';
import { useTotalFiatBalanceOfAccount } from 'src/hooks/use-total-balance';
import { SectionDropdownDataInterface } from 'src/interfaces/section-dropdown-data.interface';
import { SendReceiver } from 'src/interfaces/send-receiver.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';

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

  const renderContactValue: DropdownValueComponent<SendReceiver> = ({ value }) => (
    <DropdownItemContainer>
      <ReceiverRow receiver={value} logoName={logoName} />
    </DropdownItemContainer>
  );
  const renderContactListItem: DropdownListItemComponent<SendReceiver> = ({ item }) => (
    <ReceiverRow receiver={item} logoName={logoName} />
  );

  return (
    <FormSectionDropdown
      isSearchable
      name={name}
      list={list}
      description="Select Account"
      setSearchValue={setSearchValue}
      equalityFn={contactEqualityFn}
      renderValue={renderContactValue}
      renderListItem={renderContactListItem}
      testID={testID}
      testIDProperties={testIDProperties}
    />
  );
};

interface ReceiverRowProps {
  receiver?: SendReceiver;
  logoName: CryptoLogoNameEnum;
}

const ReceiverRow: FC<ReceiverRowProps> = ({ receiver, logoName }) => {
  const accounts = useAllAccounts();
  const account = accounts.find(item => item.id === receiver?.accountId);

  return account && receiver ? (
    <AccountReceiverRow receiver={receiver} logoName={logoName} account={account} />
  ) : (
    <ReceiverRowLayout receiver={receiver} logoName={logoName} />
  );
};

const AccountReceiverRow: FC<ReceiverRowProps & { account: ReturnType<typeof useAllAccounts>[number] }> = ({
  receiver,
  logoName,
  account
}) => {
  const totalFiatBalance = useTotalFiatBalanceOfAccount(account);

  return (
    <ReceiverRowLayout
      receiver={receiver}
      logoName={logoName}
      balance={<FormattedAmount amount={totalFiatBalance} isDollarValue />}
    />
  );
};

const ReceiverRowLayout: FC<ReceiverRowProps & { balance?: React.ReactNode }> = ({ receiver, logoName, balance }) => {
  const styles = useContactFormSectionDropdownStyles();

  return (
    <View style={styles.contactContainer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{receiver?.name?.slice(0, 1).toUpperCase() ?? '?'}</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text numberOfLines={1} style={styles.name}>
            {receiver?.name ?? 'Select account'}
          </Text>
          {!!balance && <HideBalance style={styles.balance}>{balance}</HideBalance>}
        </View>
        {!!receiver?.address && (
          <View style={styles.addressRow}>
            <CryptoLogo name={logoName} size={formatSize(14)} internalSize={formatSize(14)} />
            <Text style={styles.address}>{truncateAddress(receiver.address)}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
