import React, { memo } from 'react';

import { useCallbackIfOnline } from 'src/hooks/use-callback-if-online';
import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToModal, useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { WalletSelectors } from 'src/screens/wallet/wallet.selectors';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { isDefined } from 'src/utils/is-defined';

import { BottomSheetActionButton } from '../bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { Dropdown, DropdownActionButtonsComponent, DropdownValueBaseProps } from '../dropdown/dropdown';

import { accountEqualityFn } from './account-equality-fn';

const ActionButtons: DropdownActionButtonsComponent = ({ onPress }) => {
  const navigateToModal = useNavigateToModal();
  const navigateToScreen = useNavigateToScreen();
  const { trackEvent } = useAnalytics();
  const { createHdAccount } = useShelter();

  const handleCreateNewAccountButtonPress = () => {
    createHdAccount();
    onPress();
    trackEvent(WalletSelectors.createNewAccountButton, AnalyticsEventCategory.ButtonPress);
  };

  const handleManageAccountsButtonPress = () => {
    navigateToScreen({ screen: ScreensEnum.ManageAccounts });
    onPress();
  };

  const handleImportAccountButtonPress = () => {
    navigateToModal(ModalsEnum.ChooseAccountImportType);
    onPress();
  };

  return (
    <>
      <BottomSheetActionButton
        title="Create new account"
        onPress={useCallbackIfOnline(handleCreateNewAccountButtonPress)}
      />
      <BottomSheetActionButton
        title="Import an account"
        onPress={useCallbackIfOnline(handleImportAccountButtonPress)}
      />
      <BottomSheetActionButton title="Manage accounts" onPress={handleManageAccountsButtonPress} />
    </>
  );
};

type Props = DropdownValueBaseProps<AccountBaseInterface> & TestIdProps;

export const AccountDropdownBase = memo<Props>(
  ({
    value,
    list,
    onValueChange,
    renderValue,
    renderAccountListItem,
    testID,
    testIDProperties,
    isCollectibleScreen
  }) => {
    const onLongPressHandler = () => isDefined(value) && copyStringToClipboard(value.publicKeyHash);

    return (
      <Dropdown
        testID={testID}
        testIDProperties={testIDProperties}
        description="Accounts"
        value={value}
        list={list}
        equalityFn={accountEqualityFn}
        renderValue={renderValue}
        renderListItem={renderAccountListItem}
        renderActionButtons={ActionButtons}
        onValueChange={onValueChange}
        onLongPress={onLongPressHandler}
        isCollectibleScreen={isCollectibleScreen}
      />
    );
  }
);
