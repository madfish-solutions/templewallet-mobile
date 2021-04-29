import React, { FC, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { EventFn } from '../../config/general';
import { DropdownBottomSheet } from '../bottom-sheet/dropdown-bottom-sheet/dropdown-bottom-sheet';
import { DropdownStyles } from './dropdown.styles';

export interface DropdownProps<T> {
  value?: T;
  list: T[];
  onValueChange: EventFn<T | undefined>;
}

interface DropdownRenderProps<T> {
  title: string;
  renderValue: DropdownValueComponent<T>;
  renderListItem: DropdownListItemComponent<T>;
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
      <TouchableOpacity style={DropdownStyles.valueContainer} onPress={handleSelectedItemPress}>
        {renderValue({ value })}
      </TouchableOpacity>

      <DropdownBottomSheet title={title} isOpen={isOpen} onCloseEnd={handleDropdownBottomSheetClose}>
        <View style={DropdownStyles.listContainer}>
          {list.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[DropdownStyles.valueContainer, DropdownStyles.listItemContainer]}
              onPress={() => onValueChange(item)}>
              {renderListItem({ item, index })}
            </TouchableOpacity>
          ))}
        </View>
      </DropdownBottomSheet>
    </>
  );
};
