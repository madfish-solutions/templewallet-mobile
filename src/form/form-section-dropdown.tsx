import { useField } from 'formik';
import React from 'react';

import { SectionDropdown, SectionDropdownProps } from '../components/dropdown/section-dropdown';
import { ErrorMessage } from './error-message/error-message';

interface Props<T> extends SectionDropdownProps<T> {
  name: string;
}

export const FormSectionDropdown = <T extends unknown>({
  name,
  description,
  list,
  itemHeight,
  equalityFn,
  renderValue,
  renderListItem,
  renderActionButtons,
  isSearchable
}: Props<T>) => {
  const [field, meta, helpers] = useField<T | undefined>(name);

  return (
    <>
      <SectionDropdown<T>
        list={list}
        value={field.value}
        isSearchable={isSearchable}
        description={description}
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
