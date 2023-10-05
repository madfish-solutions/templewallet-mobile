import React, { FC } from 'react';

import { AbstractField } from './abstract-field';
import { FieldProps } from './field.props';

export const ViewAdsField: FC<FieldProps> = ({ testID }) => {
  return (
    <AbstractField
      title="View Ads"
      description="I agree to share data(wallet address, IP) and get cashback at Temple Keys for viewing ads"
      testID={testID}
      name="viewAds"
    />
  );
};
