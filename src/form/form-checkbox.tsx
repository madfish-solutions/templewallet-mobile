import { useField } from 'formik';
import React, { FC, ReactNode } from 'react';

import { Checkbox } from '../components/checkbox/checkbox';
import { CheckboxProps } from '../components/checkbox/checkbox.props';
import { TestIdProps } from '../interfaces/test-id.props';
import { AnalyticsEventCategory } from '../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../utils/analytics/use-analytics.hook';
import { isDefined } from '../utils/is-defined';

import { ErrorMessage } from './error-message/error-message';

interface Props extends Pick<CheckboxProps, 'disabled' | 'size' | 'testID' | 'inverted'>, TestIdProps {
  name: string;
  descriptionNode?: ReactNode;
  error?: string;
  shouldShowError?: boolean;
}

export const FormCheckbox: FC<Props> = ({
  name,
  children,
  descriptionNode,
  disabled,
  size,
  inverted,
  testID,
  testIDProperties,
  error,
  shouldShowError = true
}) => {
  const [field, meta, helpers] = useField<boolean>(name);
  const { trackEvent } = useAnalytics();

  const handleChange = (newValue: boolean) => {
    trackEvent(testID, AnalyticsEventCategory.FormChange, testIDProperties);

    helpers.setTouched(true);
    helpers.setValue(newValue);
  };

  return (
    <>
      <Checkbox
        disabled={disabled}
        value={field.value}
        size={size}
        inverted={inverted}
        onChange={handleChange}
        testID={testID}
      >
        {children}
      </Checkbox>
      {descriptionNode}
      {shouldShowError && (
        <>
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
      )}
    </>
  );
};
