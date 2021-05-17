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
  equalityFn,
  renderValue,
  renderListItem
}: Props<T>) => {
  const [field, meta, helpers] = useField<T | undefined>(name);

  return (
    <>
      <Dropdown<T>
        title={title}
        value={field.value}
        list={list}
        equalityFn={equalityFn}
        renderValue={renderValue}
        renderListItem={renderListItem}
        onValueChange={helpers.setValue}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
