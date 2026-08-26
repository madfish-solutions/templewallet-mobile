import React, { memo } from 'react';

import { Activity } from 'src/activity/types';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

import { EvmActivityItem } from './evm-activity-item';
import { TezosActivityItem } from './tezos-activity-item';

interface Props {
  activity: Activity;
}

export const ActivityFeedItem = memo<Props>(({ activity }) =>
  activity.chain === TempleChainKind.Tezos ? (
    <TezosActivityItem activity={activity} />
  ) : (
    <EvmActivityItem activity={activity} />
  )
);
