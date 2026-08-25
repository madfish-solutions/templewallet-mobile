import React, { memo } from 'react';

import { ActivityOperKindEnum, ActivityStatus, TezosOperation } from 'src/activity/types';

import { ActivityOperationRow } from './activity-operation-row';
import { useTezosChainRef } from './hooks/use-activity-chain-ref.hook';
import { useTezosActivityAsset } from './hooks/use-tezos-activity-asset.hook';
import { getActivityOperTransferType, getTezosOperationIsShielded } from './utils';

interface Props {
  chainId: string;
  hash: string;
  operation?: TezosOperation;
  status?: ActivityStatus;
}

export const TezosActivityOperationItem = memo<Props>(({ chainId, hash, operation, status }) => {
  const chainRef = useTezosChainRef(chainId);
  const { asset, fiatRate } = useTezosActivityAsset(operation?.assetSlug, operation?.amountSigned);

  return (
    <ActivityOperationRow
      chainRef={chainRef}
      kind={operation?.kind ?? ActivityOperKindEnum.interaction}
      transferType={getActivityOperTransferType(operation)}
      isShielded={getTezosOperationIsShielded(operation)}
      hash={hash}
      status={status}
      asset={asset}
      fiatRate={fiatRate}
    />
  );
});
