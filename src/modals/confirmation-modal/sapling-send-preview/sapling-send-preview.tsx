import React, { FC } from 'react';
import { View } from 'react-native';

import { DeadEndBoundaryError } from 'src/components/error-boundary';
import { useAccountAddressForTezos } from 'src/store/wallet/wallet-selectors';
import { useTezosToken } from 'src/utils/wallet.utils';

import { OperationPreviewAssetAmounts } from '../common/operation-preview-asset-amounts';
import { OperationPreviewCard } from '../common/operation-preview-card';

interface Props {
  amount: string;
  saplingType: 'shield' | 'unshield' | 'transfer';
}

export const SaplingSendPreview: FC<Props> = ({ amount, saplingType }) => {
  const tezosAddress = useAccountAddressForTezos();

  if (!tezosAddress) {
    throw new DeadEndBoundaryError();
  }

  const amountToken = useTezosToken(amount);

  const label = saplingType === 'shield' ? 'TEZ sent' : 'Shielded TEZ sent';

  return (
    <OperationPreviewCard iconSeed={tezosAddress} description={label}>
      <View>
        <OperationPreviewAssetAmounts amount={amount} asset={amountToken} showMinusSign />
      </View>
    </OperationPreviewCard>
  );
};
