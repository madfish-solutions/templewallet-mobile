import { useField } from 'formik';
import React from 'react';

import { Dropdown, DropdownProps } from '../components/dropdown/dropdown';
import { ErrorMessage } from './error-message/error-message';

interface Props<T> extends DropdownProps<T> {
  name: string;
}

export const FormDropdown = <T extends unknown>({
  name,
  title,
  list,
  itemHeight,
  equalityFn,
  renderValue,
  renderListItem,
  renderActionButtons
}: Props<T>) => {
  const [field, meta, helpers] = useField<T | undefined>(name);

  return (
    <>
      <Dropdown<T>
        title={title}
        value={field.value}
        list={list}
        itemHeight={itemHeight}
        equalityFn={equalityFn}
        renderValue={renderValue}
        renderListItem={renderListItem}
        renderActionButtons={renderActionButtons}
        onValueChange={helpers.setValue}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
