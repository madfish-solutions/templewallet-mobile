import React, { FC, useCallback } from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { FormDropdown } from 'src/form/form-dropdown';
import { Account } from 'src/interfaces/account.interfaces.ts';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { useGetSaplingAddressForAccount } from 'src/store/sapling/sapling-selectors';
import { getAddressesOptions } from 'src/utils/get-addresses-options';

import { AccountSummary } from '../account-card';
import { AccountDetails } from '../account-card/account-details';
import { DropdownListItemComponent, DropdownValueComponent } from '../dropdown/dropdown';
import { DropdownItemContainer } from '../dropdown/dropdown-item-container/dropdown-item-container';
import { getSeedFromAccount } from '../robot-icon/robot-icon.utils';

import { accountEqualityFn } from './account-equality-fn';

interface Props extends TestIdProps {
  name: string;
  list: Account[];
  chainKind?: TempleChainKind;
}

export const AccountFormDropdown: FC<Props> = ({ name, list, chainKind, testID, testIDProperties }) => {
  const getSaplingAddressForAccount = useGetSaplingAddressForAccount();

  const renderAccountValue = useCallback<DropdownValueComponent<Account>>(
    ({ value }) => (
      <DropdownItemContainer>
        {value && (
          <AccountSummary
            variant="account"
            isShieldedTez={!chainKind}
            account={value}
            chainKind={chainKind}
            showDropdownDown
          />
        )}
      </DropdownItemContainer>
    ),
    [chainKind]
  );

  const renderAccountListItem = useCallback<DropdownListItemComponent<Account>>(
    ({ item }) => (
      <AccountDetails
        account={item}
        avatarSeed={getSeedFromAccount(item)}
        name={item.name}
        addresses={getAddressesOptions(chainKind, !chainKind, getSaplingAddressForAccount(item), item)}
        addressIconVariant="compactTransparent"
        compactAddresses
        fixedBalanceWidth={false}
      />
    ),
    [chainKind, getSaplingAddressForAccount]
  );

  return (
    <FormDropdown
      name={name}
      description="Accounts"
      list={list}
      equalityFn={accountEqualityFn}
      renderValue={renderAccountValue}
      renderListItem={renderAccountListItem}
      testID={testID}
      testIDProperties={testIDProperties}
    />
  );
};
