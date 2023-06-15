import { useField } from 'formik';
import React from 'react';

import { TestIdProps } from 'src/interfaces/test-id.props';

import { Dropdown, DropdownProps } from '../components/dropdown/dropdown';
import { ErrorMessage } from './error-message/error-message';

interface Props<T> extends DropdownProps<T>, TestIdProps {
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
  testID,
  testIDProperties
}: Props<T>) => {
  const [field, meta, helpers] = useField<T | undefined>(name);

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
        onValueChange={helpers.setValue}
        testID={testID}
        testIDProperties={testIDProperties}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
