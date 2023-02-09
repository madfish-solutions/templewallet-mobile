import { useField } from 'formik';
import React from 'react';

import { StyledRadioGroupProps, StyledRadioGroup } from 'src/components/styled-radio-group';

import { ErrorMessage } from './error-message/error-message';

interface Props<T extends string> extends StyledRadioGroupProps<T> {
  name: string;
}

export const FormRadioButtonsGroup = <T extends string>({ name, items }: Props<T>) => {
  const [field, meta, helpers] = useField<T>(name);

  return (
    <>
      <StyledRadioGroup<T> items={items} value={field.value} onChange={helpers.setValue} />
      <ErrorMessage meta={meta} />
    </>
  );
};
