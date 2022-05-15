import React, { FC } from 'react';

import { FormDropdown } from '../../form/form-dropdown';
import { DropdownValueComponent } from '../dropdown/dropdown';
import { DropdownItemContainer } from '../dropdown/dropdown-item-container/dropdown-item-container';
import { IconNameEnum } from '../icon/icon-name.enum';
import { QuoteDropdownItem, renderQuoteListItem } from './quote-dropdown-item/quote-dropdown-item';
import { quoteEqualityFn } from './quote-equality-fn';

interface Props {
  name: string;
  list: Array<string>;
}

const renderQuoteValue: DropdownValueComponent<string> = ({ value }) => (
  <DropdownItemContainer>
    <QuoteDropdownItem quote={value} actionIconName={IconNameEnum.TriangleDown} />
  </DropdownItemContainer>
);

export const QuoteFormDropdown: FC<Props> = ({ name, list }) => (
  <FormDropdown
    name={name}
    title="Quotes"
    list={list}
    equalityFn={quoteEqualityFn}
    renderValue={renderQuoteValue}
    renderListItem={renderQuoteListItem}
  />
);
