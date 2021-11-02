import React from 'react';

import { Dropdown, DropdownProps } from '../../components/dropdown/dropdown';
import { EventFn } from '../../config/general';

interface Props<T> extends DropdownProps<T> {
  value: T;
  setValueHandler?: React.Dispatch<React.SetStateAction<string>>;
}

export const SwapProviderDropdown = <T extends unknown>({
  value,
  list,
  renderValue,
  renderListItem,
  equalityFn,
  setValueHandler
}: Props<T>) => (
  <Dropdown<T>
    title={'Select provider for swap'}
    value={value}
    list={list}
    equalityFn={equalityFn}
    renderValue={renderValue}
    renderListItem={renderListItem}
    onValueChange={setValueHandler as EventFn<T | undefined, void>}
  />
);
