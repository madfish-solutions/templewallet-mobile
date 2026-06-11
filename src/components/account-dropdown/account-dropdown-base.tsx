import React, { memo, useCallback, useMemo, useRef } from 'react';

import { CopyAddressPopup, CopyAddressPopupController } from 'src/components/copy-address-popup';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { useCallbackIfOnline } from 'src/hooks/use-callback-if-online';
import { Account } from 'src/interfaces/account.interfaces';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToModal, useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { WalletSelectors } from 'src/screens/wallet/wallet.selectors';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';

import { BottomSheetActionButton } from '../bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { Dropdown, DropdownActionButtonsComponent, DropdownValueBaseProps } from '../dropdown/dropdown';

import { accountEqualityFn } from './account-equality-fn';

const ActionButtons: DropdownActionButtonsComponent = ({ closeDropdown }) => {
  const navigateToModal = useNavigateToModal();
  const navigateToScreen = useNavigateToScreen();
  const { trackEvent } = useAnalytics();
  const { createHdAccount } = useShelter();

  const handleCreateNewAccountButtonPress = () => {
    trackEvent(WalletSelectors.createNewAccountButton, AnalyticsEventCategory.ButtonPress);
    closeDropdown();
    createHdAccount();
  };

  const handleImportAccountButtonPress = () => {
    navigateToModal(ModalsEnum.ChooseAccountImportType);
  };

  const handleManageAccountsButtonPress = () => {
    closeDropdown(100);
    navigateToScreen({ screen: ScreensEnum.ManageAccounts });
  };

  return (
    <>
      <BottomSheetActionButton
        showTopBorder
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

export type AccountDropdownValueComponent = SyncFC<
  { value: Account; disabled?: boolean; isCollectibleScreen?: boolean } & TestIdProps
>;

type Props = Omit<DropdownValueBaseProps<Account>, 'value' | 'renderValue' | 'onValueChange'> & {
  value: Account;
  renderValue: AccountDropdownValueComponent;
  onValueChange: SyncFn<Account>;
} & TestIdProps;

const getAccountSectionTitle = (account: Account) => {
  switch (account.type) {
    case AccountTypeEnum.HD:
      return 'Created';
    case AccountTypeEnum.IMPORTED_CHAIN:
    case AccountTypeEnum.IMPORTED_MULTICHAIN:
      return 'Imported';
    case AccountTypeEnum.WATCH_ONLY_DEBUG:
      return 'Watch Only';
  }
};

const getAccountSectionWeight = (account: Account) => {
  switch (account.type) {
    case AccountTypeEnum.HD:
      return 0;
    case AccountTypeEnum.IMPORTED_CHAIN:
    case AccountTypeEnum.IMPORTED_MULTICHAIN:
      return 1;
    case AccountTypeEnum.WATCH_ONLY_DEBUG:
      return 2;
  }
};

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
    const copyAddressPopupRef = useRef<CopyAddressPopupController>(null);

    const groupedList = useMemo(
      () =>
        [...list].sort((accountA, accountB) => getAccountSectionWeight(accountA) - getAccountSectionWeight(accountB)),
      [list]
    );

    const onLongPressHandler = useCallback(() => {
      copyAddressPopupRef.current?.open();
    }, []);

    return (
      <>
        <Dropdown
          testID={testID}
          testIDProperties={testIDProperties}
          description="Accounts"
          value={value}
          list={groupedList}
          itemHeight={formatSize(80)}
          equalityFn={accountEqualityFn}
          renderValue={props => renderValue({ ...props, value })}
          renderListItem={renderAccountListItem}
          getListItemSectionTitle={getAccountSectionTitle}
          renderActionButtons={ActionButtons}
          onValueChange={value => {
            if (isDefined(value)) {
              onValueChange(value);
            }
          }}
          onLongPress={onLongPressHandler}
          isCollectibleScreen={isCollectibleScreen}
        />

        <CopyAddressPopup controlRef={copyAddressPopupRef} account={value} />
      </>
    );
  }
);
