import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';

import { Divider } from 'src/components/divider/divider';
import { useEvmAssetExchangeRate } from 'src/store/evm/exchange-rates/evm-exchange-rates-selectors';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { EvmSwapAsset } from 'src/types/evm-swap';
import { getFiatExchangeRate } from 'src/utils/get-fiat-exchange-rate';
import { isDefined } from 'src/utils/is-defined';

import { OperationPreviewAssetAmounts } from '../common/operation-preview-asset-amounts';
import { OperationPreviewCard } from '../common/operation-preview-card';

import { useEvmSwapPreviewStyles } from './evm-swap-preview.styles';

interface Props {
  asset: EvmSwapAsset;
  amount: string;
  amountUSD: string;
  destination: HexString;
  approval: boolean;
}

export const EvmSwapPreview: FC<Props> = ({ asset, amount, amountUSD, destination, approval }) => {
  const styles = useEvmSwapPreviewStyles();
  const exchangeRate = useEvmAssetExchangeRate(asset.chainId, asset.assetSlug);
  const fiatToUsdRate = useFiatToUsdRateSelector();
  const quotedUsdRate = new BigNumber(amountUSD).dividedBy(new BigNumber(amount).shiftedBy(-asset.decimals));
  const quotedExchangeRate =
    quotedUsdRate.isFinite() && quotedUsdRate.gt(0)
      ? getFiatExchangeRate(quotedUsdRate.toNumber(), fiatToUsdRate)
      : undefined;
  const previewAsset = { ...asset, exchangeRate: asset.exchangeRate ?? exchangeRate ?? quotedExchangeRate };

  return (
    <OperationPreviewCard
      iconSeed={destination}
      description={approval ? 'Approve' : 'Transfer to'}
      publicKeyHash={destination}
      style={styles.card}
    >
      <Divider size={formatSize(8)} />
      <OperationPreviewAssetAmounts
        asset={previewAsset}
        amount={amount}
        receiver={destination}
        showMinusSign={!approval}
        showDollar={isDefined(previewAsset.exchangeRate)}
        hideApproximateSign
        textStyle={approval ? styles.approvalAmount : undefined}
      />
    </OperationPreviewCard>
  );
};
