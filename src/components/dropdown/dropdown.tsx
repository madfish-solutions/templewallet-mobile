import React, { FC, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { EventFn } from '../../config/general';
import { DropdownStyles } from './dropdown.styles';

export interface DropdownProps<T> {
  value?: T;
  list: T[];
  onValueChange: EventFn<T | undefined>;
}

interface DropdownRenderProps<T> {
  renderValue: DropdownValueComponent<T>;
}

export type DropdownValueComponent<T> = FC<{
  value?: T;
}>;

export const Dropdown = <T extends unknown>({
  value,
  list,
  onValueChange,
  renderValue
}: DropdownProps<T> & DropdownRenderProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectedItemPress = () => setIsOpen(value => !value);

  return (
    <TouchableOpacity style={DropdownStyles.valueContainer} onPress={handleSelectedItemPress}>
      {renderValue({ value })}
    </TouchableOpacity>
  );
};
