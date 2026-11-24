import React, { FC } from 'react';

import { Divider } from 'src/components/divider/divider';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { formatSize } from 'src/styles/format-size';

import { OperationPreviewAssetAmounts } from './operation-preview-asset-amounts';
import { OperationPreviewCard } from './operation-preview-card';

interface Props {
  asset: AssetInterface;
  receiverAddress: HexString;
  atomicAmount: string;
}

export const EvmTransferPreview: FC<Props> = ({ asset, receiverAddress, atomicAmount }) => (
  <OperationPreviewCard iconSeed={receiverAddress} description="Transfer to" publicKeyHash={receiverAddress}>
    <Divider size={formatSize(8)} />
    <OperationPreviewAssetAmounts asset={asset} amount={atomicAmount} receiver={receiverAddress} showMinusSign />
  </OperationPreviewCard>
);
