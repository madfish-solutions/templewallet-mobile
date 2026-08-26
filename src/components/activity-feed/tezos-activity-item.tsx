import React, { memo, useMemo } from 'react';

import { TezosActivity } from 'src/activity/types';

import { ActivityOperationRow } from './activity-operation-row';
import { useTezosChainRef } from './hooks/use-activity-chain-ref.hook';
import { useTezosActivityAsset } from './hooks/use-tezos-activity-asset.hook';
import { TezosActivityOperationItem } from './tezos-activity-operation-item';
import { BUNDLE_FACE_KIND } from './types';
import { getTezosBundleFaceAsset } from './utils';

interface Props {
  activity: TezosActivity;
}

const TezosActivityBundleItem = memo<Props>(({ activity }) => {
  const { chainId, hash, operations, status } = activity;

  const chainRef = useTezosChainRef(chainId);
  const faceAsset = useMemo(() => getTezosBundleFaceAsset(operations), [operations]);
  const { asset, fiatRate } = useTezosActivityAsset(faceAsset.assetSlug, faceAsset.amountSigned);

  return (
    <ActivityOperationRow
      chainRef={chainRef}
      kind={BUNDLE_FACE_KIND}
      hash={hash}
      status={status}
      asset={asset}
      fiatRate={fiatRate}
    />
  );
});

export const TezosActivityItem = memo<Props>(({ activity }) => {
  const { chainId, hash, operations, status } = activity;

  if (operations.length > 1) {
    return <TezosActivityBundleItem activity={activity} />;
  }

  return <TezosActivityOperationItem chainId={chainId} hash={hash} operation={operations.at(0)} status={status} />;
});
