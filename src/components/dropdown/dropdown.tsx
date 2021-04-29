import React, { FC, useState } from 'react';

import { EventFn } from '../../config/general';
import { DropdownBottomSheet } from '../bottom-sheet/dropdown-bottom-sheet/dropdown-bottom-sheet';
import { DropdownItemContainer } from './dropdown-item-container/dropdown-item-container';

export interface DropdownProps<T> {
  title: string;
  list: T[];
  renderValue: DropdownValueComponent<T>;
  renderListItem: DropdownListItemComponent<T>;
}

interface DropdownRenderProps<T> {
  value?: T;
  onValueChange: EventFn<T | undefined>;
}

export type DropdownValueComponent<T> = FC<{
  value?: T;
}>;

export type DropdownListItemComponent<T> = FC<{
  item: T;
  index: number;
}>;

export const Dropdown = <T extends unknown>({
  value,
  list,
  onValueChange,
  title,
  renderValue,
  renderListItem
}: DropdownProps<T> & DropdownRenderProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectedItemPress = () => setIsOpen(value => !value);
  const handleDropdownBottomSheetClose = () => setIsOpen(false);

  return (
    <>
      <DropdownItemContainer onPress={handleSelectedItemPress}>{renderValue({ value })}</DropdownItemContainer>

      <DropdownBottomSheet title={title} isOpen={isOpen} onCloseEnd={handleDropdownBottomSheetClose}>
        {list.map((item, index) => (
          <DropdownItemContainer
            key={index}
            hasMargin={true}
            isSelected={item === value}
            onPress={() => onValueChange(item)}>
            {renderListItem({ item, index })}
          </DropdownItemContainer>
        ))}
      </DropdownBottomSheet>
    </>
  );
};
