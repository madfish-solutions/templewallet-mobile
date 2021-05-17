import React, { FC } from 'react';

import { FormDropdown } from '../../form/form-dropdown';
import { AccountInterface } from '../../interfaces/account.interface';
import { renderAccountListItem, renderAccountValue } from './account-dropdown-item/account-dropdown-item';

interface Props {
  name: string;
  list: AccountInterface[];
}

export const AccountFormDropdown: FC<Props> = ({ name, list }) => (
  <FormDropdown
    name={name}
    title="Accounts"
    list={list}
    renderValue={renderAccountValue}
    renderListItem={renderAccountListItem}
  />
);
