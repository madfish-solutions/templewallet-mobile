import React, { FC } from 'react';

import { WalletSelectors } from 'src/screens/wallet/wallet.selectors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { AccountBaseInterface } from '../../interfaces/account.interface';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { copyStringToClipboard } from '../../utils/clipboard.utils';
import { isDefined } from '../../utils/is-defined';
import { BottomSheetActionButton } from '../bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { Dropdown, DropdownActionButtonsComponent, DropdownValueBaseProps } from '../dropdown/dropdown';
import { accountEqualityFn } from './account-equality-fn';

const ActionButtons: DropdownActionButtonsComponent = ({ onPress }) => {
  const { navigate } = useNavigation();
  const { trackEvent } = useAnalytics();
  const { createHdAccount } = useShelter();

  const handleCreateNewAccountButtonPress = () => {
    createHdAccount();
    onPress();
    trackEvent(WalletSelectors.createNewAccountButton, AnalyticsEventCategory.ButtonPress);
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

export const AccountDropdownBase: FC<DropdownValueBaseProps<AccountBaseInterface>> = ({
  value,
  list,
  onValueChange,
  renderValue,
  renderAccountListItem
}) => {
  const onLongPressHandler = () => isDefined(value) && copyStringToClipboard(value.publicKeyHash);

  return (
    <Dropdown
      description="Accounts"
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
