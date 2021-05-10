import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AccountInterface } from '../../../interfaces/account.interface';
import { useAccountDropdownItemStyles } from './account-dropdown-item.styles';

interface Props {
  account: AccountInterface;
}

export const AccountDropdownItem: FC<Props> = ({ account }) => {
  const styles = useAccountDropdownItemStyles();

  return (
    <View style={styles.root}>
      <View style={styles.icon} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{account.name}</Text>
        <Text style={styles.publicKeyHash} numberOfLines={1} ellipsizeMode="middle">
          {account.publicKeyHash}
        </Text>
      </View>
    </View>
  );
};
