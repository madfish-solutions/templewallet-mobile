import { useField } from 'formik';
import React, { FC } from 'react';

import { Checkbox } from '../components/checkbox/checkbox';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
}

export const FormCheckbox: FC<Props> = ({ name, children }) => {
  const [field, meta, helpers] = useField<boolean>(name);

  const handleChange = (newValue: boolean) => {
    helpers.setTouched(true);
    helpers.setValue(newValue);
  };

  return (
    <>
      <Checkbox value={field.value} onChange={handleChange}>
        {children}
      </Checkbox>
      <ErrorMessage meta={meta} />
    </>
  );
};
