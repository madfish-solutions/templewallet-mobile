import { useField } from 'formik';
import React, { useCallback } from 'react';

import { StyledRadioGroupProps, StyledRadioGroup } from 'src/components/styled-radio-group';

import { emptyFn } from '../config/general';

import { ErrorMessage } from './error-message/error-message';

interface Props<T extends string> extends StyledRadioGroupProps<T> {
  name: string;
  onChange?: (value: T) => void;
}

export const FormRadioButtonsGroup = <T extends string>({ name, items, onChange = emptyFn }: Props<T>) => {
  const [field, meta, helpers] = useField<T>(name);

  const handleChange = useCallback(
    (value: T) => {
      helpers.setValue(value);
      onChange(value);
    },
    [helpers, onChange]
  );

  return (
    <>
      <StyledRadioGroup<T> items={items} value={field.value} onChange={handleChange} />
      <ErrorMessage meta={meta} />
    </>
  );
};
