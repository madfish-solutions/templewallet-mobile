import { useField } from 'formik';
import React from 'react';

import {
  RadioButtonsGroupProps,
  StyledRadioButtonsGroup
} from '../components/styled-radio-buttons-group/styled-radio-buttons-group';
import { ErrorMessage } from './error-message/error-message';

interface Props<T extends string> extends RadioButtonsGroupProps<T> {
  name: string;
}

export const FormRadioButtonsGroup = <T extends string>({ name, buttons }: Props<T>) => {
  const [field, meta, helpers] = useField<T>(name);

  return (
    <>
      <StyledRadioButtonsGroup<T> buttons={buttons} value={field.value} onChange={helpers.setValue} />
      <ErrorMessage meta={meta} />
    </>
  );
};
