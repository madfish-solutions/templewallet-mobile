import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';

import { EventFn } from '../../config/general';
import { DropdownBottomSheet } from '../bottom-sheet/dropdown-bottom-sheet/dropdown-bottom-sheet';
import { useBottomSheetController } from '../bottom-sheet/use-bottom-sheet-controller';
import { DropdownItemContainer } from './dropdown-item-container/dropdown-item-container';
import { DropdownStyles } from './dropdown.styles';

export interface DropdownProps<T> {
  title: string;
  list: T[];
  equalityFn: DropdownEqualityFn<T>;
  renderValue: DropdownValueComponent<T>;
  renderListItem: DropdownListItemComponent<T>;
}

export interface DropdownValueProps<T> {
  value?: T;
  list: T[];
  onValueChange: EventFn<T | undefined>;
}

export type DropdownEqualityFn<T> = (item: T, value?: T) => boolean;

export type DropdownValueComponent<T> = FC<{
  value?: T;
}>;

export type DropdownListItemComponent<T> = FC<{
  item: T;
  index: number;
  isSelected: boolean;
}>;

export const Dropdown = <T extends unknown>({
  value,
  list,
  title,
  equalityFn,
  renderValue,
  renderListItem,
  onValueChange
}: DropdownProps<T> & DropdownValueProps<T>) => {
  const dropdownBottomSheetController = useBottomSheetController();

  const createDropdownItemPressHandler = (item: T) => () => {
    onValueChange(item);
    dropdownBottomSheetController.close();
  };

  return (
    <>
      <TouchableOpacity style={DropdownStyles.valueContainer} onPress={dropdownBottomSheetController.open}>
        {renderValue({ value })}
      </TouchableOpacity>

      <DropdownBottomSheet title={title} controller={dropdownBottomSheetController}>
        {list.map((item, index) => {
          const isSelected = equalityFn(item, value);

          return (
            <TouchableOpacity key={index} onPress={createDropdownItemPressHandler(item)}>
              <DropdownItemContainer hasMargin={true} isSelected={isSelected}>
                {renderListItem({ item, index, isSelected })}
              </DropdownItemContainer>
            </TouchableOpacity>
          );
        })}
      </DropdownBottomSheet>
    </>
  );
};
