import React, { memo } from 'react';

import type { ActivityFeedAssetFilter } from 'src/activity/feed';
import { Activity } from 'src/activity/types';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

import { EvmActivityItem } from './evm-activity-item';
import { TezosActivityItem } from './tezos-activity-item';

interface Props {
  activity: Activity;
  faceAssetFilter?: ActivityFeedAssetFilter;
}

export const ActivityFeedItem = memo<Props>(({ activity, faceAssetFilter }) => {
  const withoutAssetIcon = faceAssetFilter != null;

  return activity.chain === TempleChainKind.Tezos ? (
    <TezosActivityItem
      activity={activity}
      faceAssetSlug={faceAssetFilter?.chainKind === TempleChainKind.Tezos ? faceAssetFilter.assetSlug : undefined}
      withoutAssetIcon={withoutAssetIcon}
    />
  ) : (
    <EvmActivityItem
      activity={activity}
      faceAssetContract={faceAssetFilter?.chainKind === TempleChainKind.EVM ? faceAssetFilter.contract : undefined}
      withoutAssetIcon={withoutAssetIcon}
    />
  );
});
