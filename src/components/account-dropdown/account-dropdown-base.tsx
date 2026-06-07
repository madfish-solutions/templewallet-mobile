import React, { memo, useMemo, useState } from 'react';

import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { useCallbackIfOnline } from 'src/hooks/use-callback-if-online';
import { Account } from 'src/interfaces/account.interfaces';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToModal, useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { WalletSelectors } from 'src/screens/wallet/wallet.selectors';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { useSaplingAddressForAccount } from 'src/store/sapling/sapling-selectors.ts';
import { formatSize } from 'src/styles/format-size';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';

import { CopyAddressModal, CopyAddressOption } from '../../modals/copy-address-modal';
import { isTruthy } from '../../utils/is-truthy.ts';
import { BottomSheetActionButton } from '../bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { Dropdown, DropdownActionButtonsComponent, DropdownValueBaseProps } from '../dropdown/dropdown';
import { IconNameEnum } from '../icon/icon-name.enum';

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
    const [isCopyAddressDropdownVisible, setIsCopyAddressDropdownVisible] = useState(false);
    const saplingAddress = useSaplingAddressForAccount(value);

    const groupedList = useMemo(
      () =>
        [...list].sort((accountA, accountB) => getAccountSectionWeight(accountA) - getAccountSectionWeight(accountB)),
      [list]
    );

    const copyAddressOptions = useMemo<CopyAddressOption[]>(() => {
      const tezosAddress = getAccountAddressForTezos(value);
      const evmAddress = getAccountAddressForEvm(value);

      return [
        isDefined(tezosAddress) && {
          label: 'Tezos',
          address: tezosAddress,
          iconName: IconNameEnum.TezToken
        },
        isDefined(saplingAddress) && {
          label: 'Shielded',
          address: saplingAddress,
          iconName: IconNameEnum.TezShieldedToken
        },
        isDefined(evmAddress) && {
          label: 'Etherlink',
          address: evmAddress,
          iconName: IconNameEnum.EtherlinkToken
        }
      ].filter(isTruthy);
    }, [saplingAddress, value]);

    const closeCopyAddressDropdown = () => setIsCopyAddressDropdownVisible(false);

    const onLongPressHandler = () => {
      if (copyAddressOptions.length > 0) {
        setIsCopyAddressDropdownVisible(true);
      }
    };

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

        <CopyAddressModal
          isVisible={isCopyAddressDropdownVisible}
          options={copyAddressOptions}
          onClose={closeCopyAddressDropdown}
        />
      </>
    );
  }
);
