import React, { memo } from 'react';

import { AbstractField } from './abstract-field';
import { FieldProps } from './field.props';

export const AnalyticsField = memo<FieldProps>(({ name, testID }) => (
  <AbstractField title="Usage Analytics" testID={testID} name={name} />
));
