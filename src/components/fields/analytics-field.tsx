import React, { FC } from 'react';

import { TextLink } from 'src/components/text-link/text-link';
import { analyticsCollecting } from 'src/config/socials';

import { AbstractField } from './abstract-field';
import { FieldProps } from './field.props';

export const AnalyticsField: FC<FieldProps> = ({ name, testID }) => {
  return (
    <AbstractField
      title="Analytics"
      description={
        <>
          I agree to the <TextLink url={analyticsCollecting}>anonymous information collecting</TextLink>
        </>
      }
      testID={testID}
      name={name}
    />
  );
};
