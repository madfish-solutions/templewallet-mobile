import { Activity, ActivityType } from '@temple-wallet/transactions-parser';
import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';

import { NonZeroAmounts } from 'src/interfaces/non-zero-amounts.interface';

import { BakingRewardsInfo } from './baking-rewards-info';
import { DelegationInfo } from './delegation-info';
import { ReceiveInfo } from './receive-info';
import { SendInfo } from './send-info';
import { UnknownInfo } from './unknown-info';

const nonZeroAmounts2: NonZeroAmounts = {
  amounts: [
    {
      parsedAmount: new BigNumber(888),
      isPositive: true,
      symbol: 'XTZ',
      exchangeRate: 0.89
    }
  ],
  dollarSums: [new BigNumber(888)]
};

export const ActivityInfo: FC<{ activity: Activity; nonZeroAmounts: NonZeroAmounts }> = ({
  activity,
  nonZeroAmounts
}) => {
  console.log('activity.type: ', activity.type);
  console.log('activity.to: ', activity.to);

  switch (activity.type) {
    case ActivityType.Send:
      return <SendInfo address={activity.to.address} nonZeroAmounts={nonZeroAmounts} />;
    case ActivityType.Recieve:
      return <ReceiveInfo address={activity.from.address} nonZeroAmounts={nonZeroAmounts} />;
    case ActivityType.BakingRewards:
      return <BakingRewardsInfo address={activity.from.address} nonZeroAmounts={nonZeroAmounts} />;
    case ActivityType.Delegation:
      return <DelegationInfo address={activity.to?.address} />;

    default:
      return <UnknownInfo nonZeroAmounts={nonZeroAmounts2} />;
  }
};
