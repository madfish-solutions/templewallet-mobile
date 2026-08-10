import React, { FC, useCallback, useMemo } from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { FormSectionDropdown } from 'src/form/form-section-dropdown';
import { SectionDropdownDataInterface } from 'src/interfaces/section-dropdown-data.interface';
import { SendReceiver } from 'src/interfaces/send-receiver.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';

import { DropdownListItemComponent, DropdownValueComponent } from '../dropdown/dropdown';

import { useContactFormSectionDropdownStyles } from './contact-form-section-dropdown.styles';
import { ReceiverRow } from './receiver-row';

interface Props extends TestIdProps {
  name: string;
  list: Array<SectionDropdownDataInterface<SendReceiver>>;
  receiversList: Array<SectionDropdownDataInterface<SendReceiver>>;
  setSearchValue: SyncFn<string>;
  chainKind: TempleChainKind;
  isShieldedTez?: boolean;
}

export const KnownRecipientInput: FC<Props> = ({
  name,
  list,
  receiversList,
  setSearchValue,
  chainKind,
  isShieldedTez = false,
  testID,
  testIDProperties
}) => {
  const styles = useContactFormSectionDropdownStyles();
  const receiversByAddress = useMemo(() => {
    const result = new Map<string, SendReceiver>();

    receiversList
      .flatMap(section => section.data)
      .forEach(receiver => {
        if (!result.has(receiver.address) || receiver.kind === 'account') {
          result.set(receiver.address, receiver);
        }
      });

    return result;
  }, [receiversList]);
  const addressList = useMemo(
    () => list.map(section => ({ ...section, data: section.data.map(receiver => receiver.address) })),
    [list]
  );

  const renderValue = useCallback<DropdownValueComponent<string>>(
    ({ value }) => {
      const receiver = value ? receiversByAddress.get(value) : undefined;

      return receiver ? (
        <ReceiverRow
          receiver={receiver}
          chainKind={chainKind}
          isShieldedTez={isShieldedTez}
          showDropdownDown
          withCard
        />
      ) : null;
    },
    [chainKind, isShieldedTez, receiversByAddress]
  );
  const renderListItem = useCallback<DropdownListItemComponent<string>>(
    ({ item }) => {
      const receiver = receiversByAddress.get(item);

      return receiver ? <ReceiverRow receiver={receiver} chainKind={chainKind} isShieldedTez={isShieldedTez} /> : null;
    },
    [chainKind, isShieldedTez, receiversByAddress]
  );

  return (
    <FormSectionDropdown<string>
      isSearchable
      name={name}
      list={addressList}
      description="My Accounts"
      emptyListText="No records found"
      setSearchValue={setSearchValue}
      equalityFn={areAddressesEqual}
      renderValue={renderValue}
      renderListItem={renderListItem}
      itemContainerStyle={styles.listAccountContainer}
      showCloseButton
      testID={testID}
      testIDProperties={testIDProperties}
    />
  );
};

const areAddressesEqual = (address: string, value: string) => address === value;
