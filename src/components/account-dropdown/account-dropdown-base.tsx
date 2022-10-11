import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { AccountInterface } from '../../interfaces/account.interface';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { setLoadingAction } from '../../store/settings/settings-actions';
import { copyStringToClipboard } from '../../utils/clipboard.utils';
import { isDefined } from '../../utils/is-defined';
import { BottomSheetActionButton } from '../bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { Dropdown, DropdownActionButtonsComponent, DropdownValueBaseProps } from '../dropdown/dropdown';
import { accountEqualityFn } from './account-equality-fn';

const ActionButtons: DropdownActionButtonsComponent = ({ onPress }) => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const { createHdAccount } = useShelter();

  const handleCreateNewAccountButtonPress = () => {
    dispatch(setLoadingAction(true));
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

export const AccountDropdownBase: FC<DropdownValueBaseProps<AccountInterface>> = ({
  value,
  list,
  onValueChange,
  renderValue,
  renderAccountListItem
}) => {
  const onLongPressHandler = () => isDefined(value) && copyStringToClipboard(value.publicKeyHash);

  return (
    <Dropdown
      title="Accounts"
      value={value}
      list={list}
      equalityFn={accountEqualityFn}
      renderValue={renderValue}
      renderListItem={renderAccountListItem}
      renderActionButtons={ActionButtons}
      onValueChange={onValueChange}
      onLongPress={onLongPressHandler}
    />
  );
};
