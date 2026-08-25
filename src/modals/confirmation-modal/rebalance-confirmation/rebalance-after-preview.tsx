import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { DeadEndBoundaryError } from 'src/components/error-boundary';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { useSaplingAddressSelector } from 'src/store/sapling';
import { useAssetExchangeRate } from 'src/store/settings/settings-selectors';
import { useAccountAddressForTezos } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { TEZ_TOKEN_DECIMALS, TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { getDollarValue } from 'src/utils/balance.utils';
import { mutezToTz } from 'src/utils/tezos.util';
import { useTezosToken } from 'src/utils/wallet.utils';

import { OperationPreviewAssetAmounts } from '../common/operation-preview-asset-amounts';
import { OperationPreviewCard } from '../common/operation-preview-card';
import { OperationPreviewDescription } from '../common/operation-preview-description';

import { useRebalanceAfterPreviewStyles } from './rebalance-after-preview.styles';

interface Props {
  amount: string;
  direction: 'shield' | 'unshield';
}

export const RebalanceAfterPreview: FC<Props> = ({ amount, direction }) => {
  const styles = useRebalanceAfterPreviewStyles();
  const tezosAddress = useAccountAddressForTezos();

  if (!tezosAddress) {
    throw new DeadEndBoundaryError();
  }

  const saplingAddress = useSaplingAddressSelector();
  const amountToken = useTezosToken(amount);
  const exchangeRate = useAssetExchangeRate(TEZ_TOKEN_SLUG);

  const isUnshield = direction === 'unshield';
  const minusLabel = isUnshield ? 'Shielded TEZ sent' : 'TEZ sent';
  const plusLabel = isUnshield ? 'TEZ received' : 'Shielded TEZ received';

  const formattedAmount = useMemo(() => mutezToTz(new BigNumber(amount), TEZ_TOKEN_DECIMALS).toFormat(), [amount]);

  const dollarValue = useMemo(() => {
    if (exchangeRate == null) {
      return null;
    }

    return getDollarValue(amount, TEZ_TOKEN_DECIMALS, exchangeRate).toFixed(2);
  }, [amount, exchangeRate]);

  return (
    <>
      <OperationPreviewCard
        iconSeed={tezosAddress}
        iconSize={formatSize(40)}
        description={
          <RebalanceOperationDescription label={minusLabel} saplingAddress={isUnshield ? saplingAddress : null} />
        }
      >
        <View>
          <OperationPreviewAssetAmounts amount={amount} asset={amountToken} showMinusSign />
        </View>
      </OperationPreviewCard>
      <Divider size={formatSize(8)} />

      <OperationPreviewCard
        iconSeed={tezosAddress}
        iconSize={formatSize(40)}
        description={
          <RebalanceOperationDescription label={plusLabel} saplingAddress={isUnshield ? null : saplingAddress} />
        }
      >
        <View>
          <Text style={styles.creditAmount}>+ {formattedAmount} TEZ</Text>
          {dollarValue !== null && (
            <>
              <Divider size={formatSize(8)} />
              <Text style={styles.creditDollar}>≈ + {dollarValue}$</Text>
            </>
          )}
        </View>
      </OperationPreviewCard>
    </>
  );
};

interface RebalanceOperationDescriptionProps {
  label: string;
  saplingAddress: string | null;
}

const RebalanceOperationDescription: FC<RebalanceOperationDescriptionProps> = ({ label, saplingAddress }) => (
  <View>
    <OperationPreviewDescription>{label}</OperationPreviewDescription>
    {!!saplingAddress && (
      <>
        <Divider size={formatSize(4)} />
        <PublicKeyHashText publicKeyHash={saplingAddress} />
      </>
    )}
  </View>
);
