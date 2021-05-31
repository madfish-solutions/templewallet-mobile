import { useField } from 'formik';
import React, { FC } from 'react';

import { Slider } from '../components/slider/slider';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
}

export const FormInputSlider: FC<Props> = ({ name, children }) => {
  const [field, meta, helpers] = useField<number>(name);

  return (
    <>
      <Slider value={field.value} onValueChange={helpers.setValue}>
        {children}
      </Slider>
      <ErrorMessage meta={meta} />
    </>
  );
};
