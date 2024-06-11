import React, { memo } from 'react';

import { AbstractField } from './abstract-field';
import { FieldProps } from './field.props';

export const ViewAdsField = memo<FieldProps>(({ testID }) => (
  <AbstractField title="Earn Rewards with Ads" testID={testID} name="viewAds" />
));
