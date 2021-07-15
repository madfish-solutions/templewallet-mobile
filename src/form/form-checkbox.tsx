import { useField } from 'formik';
import React, { FC } from 'react';

import { Checkbox } from '../components/checkbox/checkbox';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  disabled?: boolean;
  name: string;
  size?: number;
}

export const FormCheckbox: FC<Props> = ({ name, children, disabled, size }) => {
  const [field, meta, helpers] = useField<boolean>(name);

  const handleChange = (newValue: boolean) => {
    helpers.setTouched(true);
    helpers.setValue(newValue);
  };

  return (
    <>
      <Checkbox disabled={disabled} value={field.value} onChange={handleChange} size={size}>
        {children}
      </Checkbox>
      <ErrorMessage meta={meta} />
    </>
  );
};
