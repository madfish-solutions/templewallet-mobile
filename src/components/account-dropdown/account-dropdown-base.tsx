import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

import { CopyAddressPopup } from 'src/components/copy-address-popup';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { Account } from 'src/interfaces/account.interfaces';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';
import { isDefined } from 'src/utils/is-defined';
import { includesIgnoreCase } from 'src/utils/string.utils';

import { Dropdown, DropdownActionButtonsComponent, DropdownValueBaseProps } from '../dropdown/dropdown';
import { OptionsPopupController } from '../options-popup';

import { accountEqualityFn } from './account-equality-fn';

export type AccountDropdownValueComponent = SyncFC<
  { value: Account; disabled?: boolean; isCollectibleScreen?: boolean } & TestIdProps
>;

type Props = Omit<DropdownValueBaseProps<Account>, 'value' | 'renderValue' | 'onValueChange'> & {
  value: Account;
  renderValue: AccountDropdownValueComponent;
  onValueChange: SyncFn<Account>;
  renderSearchActionButtons?: DropdownActionButtonsComponent;
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
    isCollectibleScreen,
    renderSearchActionButtons
  }) => {
    const triggerRef = useRef<View>(null);
    const copyAddressPopupRef = useRef<OptionsPopupController>(null);
    const [searchValue, setSearchValue] = useState('');

    const groupedList = useMemo(
      () =>
        Array.from(list)
          .filter(account => {
            const tezosAddress = getAccountAddressForTezos(account);
            const evmAddress = getAccountAddressForEvm(account);

            return (
              includesIgnoreCase(account.name, searchValue) ||
              (tezosAddress && includesIgnoreCase(tezosAddress, searchValue)) ||
              (evmAddress && includesIgnoreCase(evmAddress, searchValue))
            );
          })
          .sort((accountA, accountB) => getAccountSectionWeight(accountA) - getAccountSectionWeight(accountB)),
      [list, searchValue]
    );

    const onLongPressHandler = useCallback(() => {
      copyAddressPopupRef.current?.open();
    }, []);

    return (
      <>
        <Dropdown
          testID={testID}
          testIDProperties={testIDProperties}
          description="My Accounts"
          isSearchable
          value={value}
          list={groupedList}
          itemHeight={formatSize(90)}
          equalityFn={accountEqualityFn}
          renderValue={props => renderValue({ ...props, value })}
          renderListItem={renderAccountListItem}
          getListItemSectionTitle={getAccountSectionTitle}
          setSearchValue={setSearchValue}
          onValueChange={value => {
            if (isDefined(value)) {
              onValueChange(value);
            }
          }}
          onLongPress={onLongPressHandler}
          isCollectibleScreen={isCollectibleScreen}
          renderSearchActionButtons={renderSearchActionButtons}
          triggerRef={triggerRef}
        />

        <CopyAddressPopup controlRef={copyAddressPopupRef} account={value} triggerRef={triggerRef} />
      </>
    );
  }
);
