import { Activity, ActivityType } from '@temple-wallet/transactions-parser';
import React, { FC } from 'react';

import { NonZeroAmounts } from 'src/interfaces/non-zero-amounts.interface';

import { BakingRewardsDetails } from './baking-rewards';
import { DelegateDetails } from './delegate';
import { ReceiveTokensDetails } from './receive-tokens';
import { SendTokensDetails } from './send-tokens';
import { UnknownDetails } from './unknown-details';

export const DetailsCard: FC<{ activity: Activity; nonZeroAmounts: NonZeroAmounts }> = ({
  activity,
  nonZeroAmounts
}) => {
  switch (activity.type) {
    case ActivityType.Send:
      return <SendTokensDetails nonZeroAmounts={nonZeroAmounts} address={activity.to.address} hash={activity.hash} />;

    case ActivityType.BakingRewards:
      return (
        <BakingRewardsDetails nonZeroAmounts={nonZeroAmounts} address={activity.from.address} hash={activity.hash} />
      );

    case ActivityType.Recieve:
      return (
        <ReceiveTokensDetails nonZeroAmounts={nonZeroAmounts} address={activity.from.address} hash={activity.hash} />
      );

    case ActivityType.Delegation:
      return <DelegateDetails address={activity.to?.address} hash={activity.hash} />;

    default:
      return <UnknownDetails nonZeroAmounts={nonZeroAmounts} hash={activity.hash} />;
  }
};
