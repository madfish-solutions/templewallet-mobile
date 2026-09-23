import React, { memo, useMemo } from 'react';

import { TezosActivity } from 'src/activity/types';

import { ActivityOperationRow } from './activity-operation-row';
import { useTezosChainRef } from './hooks/use-activity-chain-ref.hook';
import { useTezosActivityAsset } from './hooks/use-tezos-activity-asset.hook';
import { TezosActivityOperationItem } from './tezos-activity-operation-item';
import { BUNDLE_FACE_KIND } from './types';
import { getTezosBundleFaceAsset, getTezosBundleIsShielded } from './utils';

interface Props {
  activity: TezosActivity;
  faceAssetSlug?: string;
  withoutAssetIcon?: boolean;
}

const TezosActivityBundleItem = memo<Props>(({ activity, faceAssetSlug, withoutAssetIcon }) => {
  const { chainId, hash, operations, status } = activity;

  const chainRef = useTezosChainRef(chainId);
  const faceAsset = useMemo(() => getTezosBundleFaceAsset(operations, faceAssetSlug), [operations, faceAssetSlug]);
  const { asset, fiatRate } = useTezosActivityAsset(faceAsset.assetSlug, faceAsset.amountSigned);

  return (
    <ActivityOperationRow
      chainRef={chainRef}
      kind={BUNDLE_FACE_KIND}
      isShielded={getTezosBundleIsShielded(operations)}
      hash={hash}
      status={status}
      asset={asset}
      fiatRate={fiatRate}
      withoutAssetIcon={withoutAssetIcon}
    />
  );
});

export const TezosActivityItem = memo<Props>(({ activity, faceAssetSlug, withoutAssetIcon }) => {
  const { chainId, hash, operations, status } = activity;

  if (operations.length > 1) {
    return (
      <TezosActivityBundleItem activity={activity} faceAssetSlug={faceAssetSlug} withoutAssetIcon={withoutAssetIcon} />
    );
  }

  return (
    <TezosActivityOperationItem
      chainId={chainId}
      hash={hash}
      operation={operations.at(0)}
      status={status}
      withoutAssetIcon={withoutAssetIcon}
    />
  );
});
