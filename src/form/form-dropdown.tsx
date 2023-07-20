import { useField } from 'formik';
import { noop } from 'lodash-es';
import React, { useCallback } from 'react';

import { Dropdown, DropdownProps, DropdownValueProps } from 'src/components/dropdown/dropdown';
import { TestIdProps } from 'src/interfaces/test-id.props';

import { ErrorMessage } from './error-message/error-message';

interface Props<T>
  extends DropdownProps<T>,
    TestIdProps,
    Partial<Pick<DropdownValueProps<T>, 'onValueChange' | 'itemTestIDPropertiesFn'>> {
  name: string;
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
  onValueChange = noop,
  testID,
  testIDProperties,
  itemTestIDPropertiesFn
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
        onValueChange={handleValueChange}
        testID={testID}
        testIDProperties={testIDProperties}
        itemTestIDPropertiesFn={itemTestIDPropertiesFn}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
