import { useField } from 'formik';
import React, { FC } from 'react';

import { SegmentedControlProps } from '../components/segmented-control/segmented-control';
import { TextSegmentControl } from '../components/segmented-control/text-segment-control/text-segment-control';

interface Props extends Pick<SegmentedControlProps<string>, 'values' | 'width'> {
  name: string;
}

export const FormTextSegmentControl: FC<Props> = ({ name, values, width }) => {
  const [field, , helpers] = useField<number>(name);

  const handleChange = (newValue: number) => {
    helpers.setTouched(true);
    helpers.setValue(newValue);
  };

  return <TextSegmentControl values={values} width={width} selectedIndex={field.value} onChange={handleChange} />;
};
