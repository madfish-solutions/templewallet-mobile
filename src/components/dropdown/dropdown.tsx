import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { EventFn } from '../../config/general';

interface Props<T> {
  value?: T;
  list: T[];
  onValueChange: EventFn<T | undefined>;
}

export const Dropdown = <T extends unknown>({ value, list, onValueChange }: Props<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectedItemPress = () => setIsOpen(value => !value);

  return (
    <TouchableOpacity onPress={handleSelectedItemPress}>
      <Text>kek</Text>
      <Text>{JSON.stringify(isOpen)}</Text>
    </TouchableOpacity>
  );
};
