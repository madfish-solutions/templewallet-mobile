import { useField } from 'formik';
import React, { FC } from 'react';

import { FileInput, FileInputProps, FileInputValue } from '../components/file-input/file-input';

import { ErrorMessage } from './error-message/error-message';

interface Props extends Omit<FileInputProps, 'value' | 'onChange'> {
  name: string;
}

export const FormFileInput: FC<Props> = ({ name }) => {
  const [field, meta, helpers] = useField<FileInputValue>(name);

  const handleChange = (value: FileInputValue) => {
    helpers.setTouched(true);
    helpers.setValue(value);
  };

  return (
    <>
      <FileInput value={field.value} onChange={handleChange} />
      <ErrorMessage meta={meta} />
    </>
  );
};
