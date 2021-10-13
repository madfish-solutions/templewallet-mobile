import React from 'react';
import { Text } from 'react-native';

import { Dropdown } from '../../components/dropdown/dropdown';

export const SwapProviderDropdown = ({ value, renderValue, listItem, setValueHandler }) => {
  const equalityFunction = (item, value) => {
    return item === value;
  };

  return (
    <Dropdown
      title={'Select provider for swap'}
      value={value}
      list={['provider1', 'provider2']}
      equalityFn={equalityFunction}
      renderValue={renderValue}
      renderListItem={listItem}
      onValueChange={setValueHandler}
    />
  );
};
