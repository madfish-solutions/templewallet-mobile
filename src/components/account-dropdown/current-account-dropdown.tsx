import React, { memo, useCallback, useMemo, useRef } from 'react';
import { Text, View } from 'react-native';

import { useCallbackIfOnline } from 'src/hooks/use-callback-if-online';
import { Account } from 'src/interfaces/account.interfaces.ts';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToModal, useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { WalletSelectors } from 'src/screens/wallet/wallet.selectors';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { dispatch } from 'src/store';
import { setSelectedAccountIdAction } from 'src/store/wallet/wallet-actions';
import { useAccount, useAllVisibleAccounts } from 'src/store/wallet/wallet-selectors';
import { commonTheme } from 'src/styles/colors';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { DropdownActionButtonsComponent, DropdownValueProps } from '../dropdown/dropdown';
import { IconV2 } from '../icon-v2';
import { IconNameV2Enum } from '../icon-v2/icon-name.enum';
import { OptionsPopupController, OptionsPopupHOC } from '../options-popup';
import { TouchableIconV2 } from '../touchable-icon-v2';

import { AccountDropdownBase, AccountDropdownValueComponent } from './account-dropdown-base';
import { AccountDropdownTriggerItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';
import { useCurrentAccountDropdownStyles } from './current-account-dropdown.styles';

const renderAccountValue: AccountDropdownValueComponent = ({ value, isCollectibleScreen }) => (
  <AccountDropdownTriggerItem
    account={value}
    showFullData={false}
    actionIconName={IconNameV2Enum.Copy}
    actionIconColor={commonTheme.blue}
    isCollectibleScreen={isCollectibleScreen}
  />
);

type Props = Omit<DropdownValueProps<Account>, 'list' | 'value' | 'onValueChange'> & TestIdProps;

interface AddAccountOption {
  icon: IconNameV2Enum;
  name: string;
  handler: EmptyFn;
}
const optionKeyFn = ({ name }: AddAccountOption) => name;

const CreateAccountPopupBase = OptionsPopupHOC<AddAccountOption>(({ option }) => {
  const { icon, name } = option;
  const styles = useCurrentAccountDropdownStyles();

  return (
    <View style={styles.popoverOptionContent}>
      <IconV2 name={icon} size={24} color={commonTheme.blue} />
      <Text style={styles.popoverOptionName}>{name}</Text>
    </View>
  );
});

const SearchActionButtons: DropdownActionButtonsComponent = ({ closeDropdown }) => {
  const navigateToScreen = useNavigateToScreen();
  const navigateToModal = useNavigateToModal();
  const createAccountButtonRef = useRef<View>(null);
  const popupControlRef = useRef<OptionsPopupController>(null);
  const { trackEvent } = useAnalytics();
  const { createHdAccount } = useShelter();

  const goToManageAccounts = useCallback(() => {
    closeDropdown();
    setTimeout(() => navigateToScreen({ screen: ScreensEnum.ManageAccounts }), 100);
  }, [closeDropdown, navigateToScreen]);

  const handleOptionPress = useCallback(({ handler }: AddAccountOption) => handler(), []);
  const openCreateAccountPopup = useCallback(() => popupControlRef.current?.open(), []);
  const closeCreateAccountPopup = useCallback(() => popupControlRef.current?.close(), []);

  const createNewAccount = useCallbackIfOnline(
    useCallback(() => {
      trackEvent(WalletSelectors.createNewAccountButton, AnalyticsEventCategory.ButtonPress);
      closeCreateAccountPopup();
      closeDropdown(createHdAccount);
    }, [closeCreateAccountPopup, closeDropdown, createHdAccount, trackEvent])
  );

  const goToImportAccount = useCallbackIfOnline(
    useCallback(() => {
      navigateToModal(ModalsEnum.ChooseAccountImportType);
      closeCreateAccountPopup();
      closeDropdown();
    }, [closeCreateAccountPopup, closeDropdown, navigateToModal])
  );

  const addAccountOptions = useMemo(
    () => [
      {
        icon: IconNameV2Enum.UserAdd,
        name: 'New account',
        handler: createNewAccount
      },
      {
        icon: IconNameV2Enum.Import,
        name: 'Import account',
        handler: goToImportAccount
      }
    ],
    [createNewAccount, goToImportAccount]
  );

  return (
    <>
      <TouchableIconV2
        name={IconNameV2Enum.Slider}
        size={formatSize(40)}
        iconSize={24}
        color={commonTheme.blue}
        onPress={useCallbackIfOnline(goToManageAccounts)}
        // TODO: add testID
      />
      <View ref={createAccountButtonRef}>
        <TouchableIconV2
          name={IconNameV2Enum.PlusBig}
          size={formatSize(40)}
          iconSize={24}
          color={commonTheme.blue}
          onPress={openCreateAccountPopup}
          key="create"
          // TODO: add testID
        />
      </View>
      <CreateAccountPopupBase
        controlRef={popupControlRef}
        title="Add account"
        options={addAccountOptions}
        keyFn={optionKeyFn}
        placement="bottom-right"
        onOptionPress={handleOptionPress}
        yOffset={formatSize(8)}
        triggerRef={createAccountButtonRef}
      />
    </>
  );
};

export const CurrentAccountDropdown = memo<Props>(({ testID, testIDProperties, isCollectibleScreen }) => {
  const selectedAccount = useAccount();
  const visibleAccounts = useAllVisibleAccounts();

  const onValueChange = useCallback((value: Account) => dispatch(setSelectedAccountIdAction(value.id)), []);

  return (
    <AccountDropdownBase
      value={selectedAccount}
      list={visibleAccounts}
      renderValue={renderAccountValue}
      renderAccountListItem={renderAccountListItem}
      onValueChange={onValueChange}
      testID={testID}
      testIDProperties={testIDProperties}
      isCollectibleScreen={isCollectibleScreen}
      renderSearchActionButtons={SearchActionButtons}
    />
  );
});
