import React, { FC } from 'react';

import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { copyStringToClipboard } from '../../utils/clipboard.utils';
import { isDefined } from '../../utils/is-defined';
import { BottomSheetActionButton } from '../bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import {
  Dropdown,
  DropdownActionButtonsComponent,
  DropdownValueComponent,
  DropdownValueProps
} from '../dropdown/dropdown';
import { IconNameEnum } from '../icon/icon-name.enum';
import { AccountDropdownItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';
import { accountEqualityFn } from './account-equality-fn';

const renderAccountValue: DropdownValueComponent<WalletAccountInterface> = ({ value }) => (
  <AccountDropdownItem account={value} showFullData={false} actionIconName={IconNameEnum.TriangleDown} />
);

const ActionButtons: DropdownActionButtonsComponent = ({ onPress }) => {
  const { navigate } = useNavigation();
  const { createHdAccount } = useShelter();

  const handleCreateNewAccountButtonPress = () => {
    createHdAccount();
    onPress();
  };

  const handleManageAccountsButtonPress = () => {
    navigate(ScreensEnum.ManageAccounts);
    onPress();
  };

  const handleImportAccountButtonPress = () => {
    navigate(ScreensEnum.ImportAccount);
    onPress();
  };

  return (
    <>
      <BottomSheetActionButton title="Create new account" onPress={handleCreateNewAccountButtonPress} />
      <BottomSheetActionButton title="Import an account" onPress={handleImportAccountButtonPress} />
      <BottomSheetActionButton title="Manage accounts" onPress={handleManageAccountsButtonPress} />
    </>
  );
};

export const CurrentAccountDropdown: FC<DropdownValueProps<WalletAccountInterface>> = ({
  value,
  list,
  onValueChange
}) => {
  const onLongPressHandler = () => isDefined(value) && copyStringToClipboard(value.publicKeyHash);

  return (
    <Dropdown
      title="Accounts"
      value={value}
      list={list}
      equalityFn={accountEqualityFn}
      renderValue={renderAccountValue}
      renderListItem={renderAccountListItem}
      renderActionButtons={ActionButtons}
      onValueChange={onValueChange}
      onLongPress={onLongPressHandler}
    />
  );
};
