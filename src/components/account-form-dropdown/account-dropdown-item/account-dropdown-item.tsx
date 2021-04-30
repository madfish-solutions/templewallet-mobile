import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AccountInterface } from '../../../interfaces/account.interface';
import { AccountDropdownItemStyles } from './account-dropdown-item.styles';

interface Props {
  account: AccountInterface;
}

export const AccountDropdownItem: FC<Props> = ({ account }) => (
  <View style={AccountDropdownItemStyles.root}>
    <View style={AccountDropdownItemStyles.icon} />
    <View style={AccountDropdownItemStyles.infoContainer}>
      <Text style={AccountDropdownItemStyles.name}>{account.name}</Text>
      <Text style={AccountDropdownItemStyles.publicKeyHash}>{account.publicKeyHash}</Text>
    </View>
  </View>
);
