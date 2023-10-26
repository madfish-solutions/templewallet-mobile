import { useField } from 'formik';
import React, { FC } from 'react';

import { Checkbox } from '../components/checkbox/checkbox';
import { CheckboxProps } from '../components/checkbox/checkbox.props';
import { TestIdProps } from '../interfaces/test-id.props';
import { AnalyticsEventCategory } from '../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../utils/analytics/use-analytics.hook';
import { isDefined } from '../utils/is-defined';

import { ErrorMessage } from './error-message/error-message';

interface Props extends Pick<CheckboxProps, 'disabled' | 'size' | 'testID'>, TestIdProps {
  name: string;
  error?: string;
}

export const FormCheckbox: FC<Props> = ({ name, children, disabled, size, testID, testIDProperties, error }) => {
  const [field, meta, helpers] = useField<boolean>(name);
  const { trackEvent } = useAnalytics();

  const handleChange = (newValue: boolean) => {
    trackEvent(testID, AnalyticsEventCategory.FormChange, testIDProperties);

    helpers.setTouched(true);
    helpers.setValue(newValue);
  };

  return (
    <>
      <Checkbox disabled={disabled} value={field.value} size={size} onChange={handleChange} testID={testID}>
        {children}
      </Checkbox>
      <ErrorMessage meta={meta} />
      {isDefined(error) && (
        <ErrorMessage
          meta={{
            ...meta,
            touched: true,
            error
          }}
        />
      )}
    </>
  );
};
