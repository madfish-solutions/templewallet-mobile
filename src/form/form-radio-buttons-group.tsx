import { useField } from 'formik';
import React from 'react';

import {
  DeprecatedRadioButtonsGroupProps,
  DeprecatedStyledRadioButtonsGroup
} from '../deprecated/deprecated-styled-radio-buttons-group/deprecated-styled-radio-buttons-group';
import { ErrorMessage } from './error-message/error-message';

interface Props<T extends string> extends DeprecatedRadioButtonsGroupProps<T> {
  name: string;
}

export const FormRadioButtonsGroup = <T extends string>({ name, buttons }: Props<T>) => {
  const [field, meta, helpers] = useField<T>(name);

  return (
    <>
      <DeprecatedStyledRadioButtonsGroup<T> buttons={buttons} value={field.value} onChange={helpers.setValue} />
      <ErrorMessage meta={meta} />
    </>
  );
};
