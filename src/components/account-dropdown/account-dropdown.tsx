import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AccountInterface } from '../../interfaces/account.interface';
import { Dropdown, DropdownProps, DropdownValueComponent } from '../dropdown/dropdown';
import { AccountDropdownValueStyles } from './account-dropdown.styles';

const renderValue: DropdownValueComponent<AccountInterface> = ({ value }) => {
  return value === undefined ? (
    <Text>Kekos</Text>
  ) : (
    <View style={AccountDropdownValueStyles.root}>
      <View style={AccountDropdownValueStyles.icon} />
      <View style={AccountDropdownValueStyles.infoContainer}>
        <Text style={AccountDropdownValueStyles.name}>{value.name}</Text>
        <Text style={AccountDropdownValueStyles.publicKeyHash}>{value.publicKeyHash}</Text>
      </View>
    </View>
  );
};

export const AccountDropdown: FC<DropdownProps<AccountInterface>> = ({ value, list, onValueChange }) => {
  return <Dropdown value={value} list={list} onValueChange={onValueChange} renderValue={renderValue} />;
};
