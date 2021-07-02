import React, { FC } from 'react';

import { FormDropdown } from '../../form/form-dropdown';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { DropdownValueComponent } from '../dropdown/dropdown';
import { DropdownItemContainer } from '../dropdown/dropdown-item-container/dropdown-item-container';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TokenDropdownItem, renderTokenListItem } from './token-dropdown-item/token-dropdown-item';
import { tokenEqualityFn } from './token-equality-fn';

interface Props {
  name: string;
  list: TokenInterface[];
}

const renderTokenValue: DropdownValueComponent<TokenInterface> = ({ value }) => (
  <DropdownItemContainer>
    <TokenDropdownItem token={value} actionIconName={IconNameEnum.TriangleDown} />
  </DropdownItemContainer>
);

export const TokenFormDropdown: FC<Props> = ({ name, list }) => (
  <FormDropdown
    name={name}
    title="Assets"
    list={list}
    equalityFn={tokenEqualityFn}
    renderValue={renderTokenValue}
    renderListItem={renderTokenListItem}
  />
);
