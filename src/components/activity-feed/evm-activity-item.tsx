import React, { memo, useMemo } from 'react';

import { EvmActivity } from 'src/activity/types';

import { ActivityOperationRow } from './activity-operation-row';
import { EvmActivityOperationItem } from './evm-activity-operation-item';
import { useEvmChainRef } from './hooks/use-activity-chain-ref.hook';
import { useEvmActivityAsset } from './hooks/use-evm-activity-asset.hook';
import { BUNDLE_FACE_KIND } from './types';
import { getEvmBundleFaceAsset, getNftTransfersCount } from './utils';

interface Props {
  activity: EvmActivity;
  faceAssetContract?: string;
  withoutAssetIcon?: boolean;
}

const EvmActivityBundleItem = memo<Props>(({ activity, faceAssetContract, withoutAssetIcon }) => {
  const { chainId, hash, operations } = activity;

  const chainRef = useEvmChainRef(chainId);
  const faceAsset = useMemo(
    () => getEvmBundleFaceAsset(operations, faceAssetContract),
    [operations, faceAssetContract]
  );
  const nftBundleCount = useMemo(() => getNftTransfersCount(operations), [operations]);
  const { asset, fiatRate } = useEvmActivityAsset(chainId, faceAsset);

  return (
    <ActivityOperationRow
      chainRef={chainRef}
      kind={BUNDLE_FACE_KIND}
      hash={hash}
      asset={asset}
      fiatRate={fiatRate}
      nftBundleCount={nftBundleCount}
      withoutAssetIcon={withoutAssetIcon}
    />
  );
});

export const EvmActivityItem = memo<Props>(({ activity, faceAssetContract, withoutAssetIcon }) => {
  const { chainId, hash, operations } = activity;

  if (operations.length > 1) {
    return (
      <EvmActivityBundleItem
        activity={activity}
        faceAssetContract={faceAssetContract}
        withoutAssetIcon={withoutAssetIcon}
      />
    );
  }

  return (
    <EvmActivityOperationItem
      chainId={chainId}
      hash={hash}
      operation={operations.at(0)}
      withoutAssetIcon={withoutAssetIcon}
    />
  );
});
