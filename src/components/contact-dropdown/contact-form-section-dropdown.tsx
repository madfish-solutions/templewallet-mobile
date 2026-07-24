import React, { FC } from 'react';
import { Text } from 'react-native';

import { FormSectionDropdown } from 'src/form/form-section-dropdown';
import { Contact } from 'src/interfaces/contact.interface.ts';
import { SectionDropdownDataInterface } from 'src/interfaces/section-dropdown-data.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';

import { DropdownListItemComponent, DropdownValueComponent } from '../dropdown/dropdown';
import { DropdownItemContainer } from '../dropdown/dropdown-item-container/dropdown-item-container';

import { contactEqualityFn } from './contact-equality-fn.ts';

interface Props extends TestIdProps {
  name: string;
  list: Array<SectionDropdownDataInterface<Contact>>;
  setSearchValue: SyncFn<string>;
}

const renderContactValue: DropdownValueComponent<Contact> = ({ value }) => (
  <DropdownItemContainer>
    <Text>{value?.name}</Text>
    <Text>{value?.address}</Text>
  </DropdownItemContainer>
);

const renderContactListItem: DropdownListItemComponent<Contact> = ({ item }) => (
  <DropdownItemContainer>
    <Text>{item.name}</Text>
    <Text>{item.address}</Text>
  </DropdownItemContainer>
);

export const ContactFormSectionDropdown: FC<Props> = ({ name, list, setSearchValue, testID, testIDProperties }) => (
  <FormSectionDropdown
    isSearchable
    name={name}
    list={list}
    description="Accounts and contacts"
    setSearchValue={setSearchValue}
    equalityFn={contactEqualityFn}
    renderValue={renderContactValue}
    renderListItem={renderContactListItem}
    testID={testID}
    testIDProperties={testIDProperties}
  />
);
