import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledCheckbox } from '../components/styled-checkbox/styled-checkbox';
import { formatSize } from '../styles/format-size';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
}

export const FormCheckbox: FC<Props> = ({ name }) => {
  const [field, meta, helpers] = useField<boolean>(name);

  return (
    <>
      <StyledCheckbox value={field.value} onValueChange={helpers.setValue} size={formatSize(20)} />
      <ErrorMessage meta={meta} />
    </>
  );
};
