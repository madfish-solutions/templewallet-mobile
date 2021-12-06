import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { setSelectedAccountAction } from '../../../store/wallet/wallet-actions';
import { useSelectedAccountSelector, useVisibleAccountsListSelector } from '../../../store/wallet/wallet-selectors';
import { ModalAccountDropdown } from '../../account-dropdown/modal-account-dropdown';
import { useHeaderModalStyles } from './header-modal.styles';

export const HeaderModal: FC = () => {
  const styles = useHeaderModalStyles();
  const dispatch = useDispatch();

  const selectedAccount = useSelectedAccountSelector();
  const visibleAccounts = useVisibleAccountsListSelector();

  return (
    <View style={styles.accountContainer}>
      <ModalAccountDropdown
        value={selectedAccount}
        list={visibleAccounts}
        onValueChange={value => dispatch(setSelectedAccountAction(value?.publicKeyHash))}
      />
    </View>
  );
};
