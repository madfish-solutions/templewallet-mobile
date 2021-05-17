import React, { FC } from 'react';

import { EventFn } from '../../config/general';
import { DropdownBottomSheet } from '../bottom-sheet/dropdown-bottom-sheet/dropdown-bottom-sheet';
import { useBottomSheetController } from '../bottom-sheet/use-bottom-sheet-controller';
import { DropdownItemContainer } from './dropdown-item-container/dropdown-item-container';

export interface DropdownProps<T> {
  title: string;
  list: T[];
  renderValue: DropdownValueComponent<T>;
  renderListItem: DropdownListItemComponent<T>;
}

export interface DropdownValueProps<T> {
  value?: T;
  list: T[];
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
}: DropdownProps<T> & DropdownValueProps<T>) => {
  const dropdownBottomSheetController = useBottomSheetController();

  const createDropdownItemPressHandler = (item: T) => () => {
    onValueChange(item);
    dropdownBottomSheetController.close();
  };

  return (
    <>
      <DropdownItemContainer onPress={dropdownBottomSheetController.open}>
        {renderValue({ value })}
      </DropdownItemContainer>

      <DropdownBottomSheet title={title} controller={dropdownBottomSheetController}>
        {list.map((item, index) => (
          <DropdownItemContainer
            key={index}
            hasMargin={true}
            isSelected={item === value}
            onPress={createDropdownItemPressHandler(item)}>
            {renderListItem({ item, index })}
          </DropdownItemContainer>
        ))}
      </DropdownBottomSheet>
    </>
  );
};
