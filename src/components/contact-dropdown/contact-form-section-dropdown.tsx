import React, { FC } from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { FormSectionDropdown } from 'src/form/form-section-dropdown';
import { SectionDropdownDataInterface } from 'src/interfaces/section-dropdown-data.interface';
import { SendReceiver } from 'src/interfaces/send-receiver.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';

import { DropdownListItemComponent, DropdownValueComponent } from '../dropdown/dropdown';

import { contactEqualityFn } from './contact-equality-fn.ts';
import { useContactFormSectionDropdownStyles } from './contact-form-section-dropdown.styles';
import { ReceiverRow } from './receiver-row';

interface Props extends TestIdProps {
  name: string;
  list: Array<SectionDropdownDataInterface<SendReceiver>>;
  setSearchValue: SyncFn<string>;
  chainKind: TempleChainKind;
  isShieldedTez?: boolean;
}

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

  const renderValue: DropdownValueComponent<SendReceiver> = ({ value }) =>
    value ? (
      <ReceiverRow receiver={value} chainKind={chainKind} isShieldedTez={isShieldedTez} showDropdownDown withCard />
    ) : null;
  const renderListItem: DropdownListItemComponent<SendReceiver> = ({ item }) => (
    <ReceiverRow receiver={item} chainKind={chainKind} isShieldedTez={isShieldedTez} />
  );

  return (
    <FormSectionDropdown
      isSearchable
      name={name}
      list={list}
      description="My Accounts"
      setSearchValue={setSearchValue}
      equalityFn={contactEqualityFn}
      renderValue={renderValue}
      renderListItem={renderListItem}
      itemContainerStyle={styles.listAccountContainer}
      showCloseButton
      testID={testID}
      testIDProperties={testIDProperties}
    />
  );
};
