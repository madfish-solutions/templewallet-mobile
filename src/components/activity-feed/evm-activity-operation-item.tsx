import React, { memo } from 'react';

import { ActivityOperKindEnum, EvmOperation } from 'src/activity/types';

import { ActivityOperationRow } from './activity-operation-row';
import { useEvmChainRef } from './hooks/use-activity-chain-ref.hook';
import { useEvmActivityAsset } from './hooks/use-evm-activity-asset.hook';
import { getActivityOperTransferType } from './utils';

interface Props {
  chainId: number;
  hash: string;
  operation?: EvmOperation;
}

export const EvmActivityOperationItem = memo<Props>(({ chainId, hash, operation }) => {
  const chainRef = useEvmChainRef(chainId);
  const { asset, fiatRate } = useEvmActivityAsset(chainId, operation?.asset);

  return (
    <ActivityOperationRow
      chainRef={chainRef}
      kind={operation?.kind ?? ActivityOperKindEnum.interaction}
      transferType={getActivityOperTransferType(operation)}
      hash={hash}
      asset={asset}
      fiatRate={fiatRate}
    />
  );
});
