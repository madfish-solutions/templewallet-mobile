import { ActivityType } from '@temple-wallet/transactions-parser';
import React, { FC, memo } from 'react';

import { BakingRewards } from './baking-rewards';
import { Delegate } from './delegate';
import { Interaction } from './interaction';
import { ActivityItemProps } from './item.props';
import { Receive } from './receive';
import { Send } from './send';
import { Unknown } from './unknown';

export const ActivityItem: FC<ActivityItemProps> = memo(({ activity }) => {
  switch (activity.type) {
    case ActivityType.Send:
      return <Send activity={activity} />;
    case ActivityType.Receive:
      return <Receive activity={activity} />;
    case ActivityType.BakingRewards:
      return <BakingRewards activity={activity} />;
    case ActivityType.Delegation:
      return <Delegate activity={activity} />;
    case ActivityType.Interaction:
      return <Interaction activity={activity} />;

    default:
      return <Unknown activity={activity} />;
  }
});
