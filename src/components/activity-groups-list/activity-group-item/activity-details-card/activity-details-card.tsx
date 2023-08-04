import { Activity, ActivityType } from '@temple-wallet/transactions-parser';
import React, { FC } from 'react';

import { NonZeroAmounts } from 'src/interfaces/non-zero-amounts.interface';

import { DelegateDetails } from './delegate-details';
import { ReceiveTokensDetails } from './receive-tokens-details';
import { SendTokensDetails } from './send-tokens-details';

export const ActivityDetailsCard: FC<{ activity: Activity; nonZeroAmounts: NonZeroAmounts }> = ({
  activity,
  nonZeroAmounts
}) => {
  switch (activity.type) {
    case ActivityType.Send:
      return <SendTokensDetails nonZeroAmounts={nonZeroAmounts} address={activity.to.address} hash={activity.hash} />;

    case ActivityType.Recieve:
    case ActivityType.BakingRewards:
      return (
        <ReceiveTokensDetails nonZeroAmounts={nonZeroAmounts} address={activity.from.address} hash={activity.hash} />
      );

    case ActivityType.Delegation:
      return <DelegateDetails address={activity.to?.address} hash={activity.hash} />;

    default:
      return null;
  }
};
