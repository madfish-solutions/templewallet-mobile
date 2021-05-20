import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';

import { AccountInterface } from '../../interfaces/account.interface';
import { ScreensEnum } from '../../navigator/screens.enum';
import { DropdownBottomSheetActionButton } from '../bottom-sheet/dropdown-bottom-sheet/dropdown-bottom-sheet-action-button/dropdown-bottom-sheet-action-button';
import {
  Dropdown,
  DropdownActionButtonsComponent,
  DropdownValueComponent,
  DropdownValueProps
} from '../dropdown/dropdown';
import { IconNameEnum } from '../icon/icon-name.enum';
import { AccountDropdownItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';
import { accountEqualityFn } from './account-equality-fn';

const renderAccountValue: DropdownValueComponent<AccountInterface> = ({ value }) => (
  <AccountDropdownItem account={value} showFullData={false} actionIconName={IconNameEnum.TriangleDown} />
);

const ActionButtons: DropdownActionButtonsComponent = ({ onPress }) => {
  const { navigate } = useNavigation();

  const handleCreateNewAccountButtonPress = () => {
    navigate(ScreensEnum.Settings, { screen: ScreensEnum.CreateHdAccount });
    onPress();
  };

  const handleManageAccountsButtonPress = () => {
    navigate(ScreensEnum.Settings, { screen: ScreensEnum.ManageAccounts });
    onPress();
  };

  return (
    <>
      <DropdownBottomSheetActionButton title="Create new account" onPress={handleCreateNewAccountButtonPress} />
      <DropdownBottomSheetActionButton title="Manage accounts" onPress={handleManageAccountsButtonPress} />
    </>
  );
};

export const CurrentAccountDropdown: FC<DropdownValueProps<AccountInterface>> = ({ value, list, onValueChange }) => (
  <Dropdown
    title="Accounts"
    value={value}
    list={list}
    equalityFn={accountEqualityFn}
    renderValue={renderAccountValue}
    renderListItem={renderAccountListItem}
    renderActionButtons={ActionButtons}
    onValueChange={onValueChange}
  />
);
