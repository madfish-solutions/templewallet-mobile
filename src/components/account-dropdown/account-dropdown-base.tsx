import React, { memo, useMemo, useState } from 'react';

import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useCallbackIfOnline } from 'src/hooks/use-callback-if-online';
import { AccountBaseInterface, AccountInterface } from 'src/interfaces/account.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToModal, useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { WalletSelectors } from 'src/screens/wallet/wallet.selectors';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { useSaplingAddressSelector } from 'src/store/sapling';
import { formatSize } from 'src/styles/format-size';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';

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

type Props = DropdownValueBaseProps<AccountBaseInterface> & TestIdProps;

const isAccountInterface = (account: AccountBaseInterface): account is AccountInterface => 'type' in account;

const getAccountSectionTitle = (account: AccountBaseInterface) =>
  isAccountInterface(account) && account.type === AccountTypeEnum.IMPORTED_ACCOUNT ? 'Imported' : 'Created';

const getAccountSectionWeight = (account: AccountBaseInterface) =>
  getAccountSectionTitle(account) === 'Created' ? 0 : 1;

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
    const saplingAddress = useSaplingAddressSelector();

    const groupedList = useMemo(
      () =>
        [...list].sort((accountA, accountB) => getAccountSectionWeight(accountA) - getAccountSectionWeight(accountB)),
      [list]
    );

    const copyAddressOptions = useMemo<CopyAddressOption[]>(() => {
      if (!isDefined(value)) {
        return [];
      }

      const tezosAddress = isAccountInterface(value) ? getAccountAddressForTezos(value) : value.publicKeyHash;
      const evmAddress = isAccountInterface(value) ? getAccountAddressForEvm(value) : undefined;

      return [
        isString(tezosAddress) && {
          label: 'Tezos',
          address: tezosAddress,
          iconName: IconNameEnum.TezToken
        },
        isString(saplingAddress) &&
          isAccountInterface(value) &&
          value.chain !== TempleChainKind.EVM && {
            label: 'Shielded',
            address: saplingAddress,
            iconName: IconNameEnum.TezShieldedToken
          },
        isString(evmAddress) && {
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
          itemHeight={formatSize(116)}
          equalityFn={accountEqualityFn}
          renderValue={renderValue}
          renderListItem={renderAccountListItem}
          getListItemSectionTitle={getAccountSectionTitle}
          renderActionButtons={ActionButtons}
          onValueChange={onValueChange}
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
