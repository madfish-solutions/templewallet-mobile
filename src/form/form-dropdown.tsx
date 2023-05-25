import { useField } from 'formik';
import { noop } from 'lodash-es';
import React, { useCallback } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { Dropdown, DropdownProps } from 'src/components/dropdown/dropdown';
import { EventFn } from 'src/config/general';

import { ErrorMessage } from './error-message/error-message';

interface Props<T> extends DropdownProps<T> {
  name: string;
  valueContainerStyle?: StyleProp<ViewStyle>;
  onValueChange?: EventFn<T | undefined>;
}

export const FormDropdown = <T extends unknown>({
  name,
  description,
  list,
  itemHeight,
  equalityFn,
  renderValue,
  renderListItem,
  renderActionButtons,
  valueContainerStyle,
  onValueChange = noop,
  testID
}: Props<T>) => {
  const [field, meta, helpers] = useField<T | undefined>(name);

  const handleValueChange = useCallback(
    (value?: T) => {
      helpers.setValue(value);
      onValueChange(value);
    },
    [helpers.setValue, onValueChange]
  );

  return (
    <>
      <Dropdown<T>
        description={description}
        value={field.value}
        list={list}
        itemHeight={itemHeight}
        equalityFn={equalityFn}
        renderValue={renderValue}
        renderListItem={renderListItem}
        renderActionButtons={renderActionButtons}
        valueContainerStyle={valueContainerStyle}
        onValueChange={handleValueChange}
        testID={testID}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
