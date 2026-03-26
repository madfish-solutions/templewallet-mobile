import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { Divider } from 'src/components/divider/divider';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { TruncatedText } from 'src/components/truncated-text';
import { useSaplingAddressSelector } from 'src/store/sapling';
import { useAssetExchangeRate } from 'src/store/settings/settings-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { TEZ_TOKEN_METADATA, TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { getDollarValue } from 'src/utils/balance.utils';
import { mutezToTz } from 'src/utils/tezos.util';
import { useTezosToken } from 'src/utils/wallet.utils';

import { useOperationsPreviewItemStyles } from '../operations-confirmation/operations-preview/operations-preview-item/operations-preview-item.styles';

interface Props {
  amount: string;
  direction: 'shield' | 'unshield';
}

export const RebalanceAfterPreview: FC<Props> = ({ amount, direction }) => {
  const styles = useOperationsPreviewItemStyles();
  const colors = useColors();
  const accountPkh = useCurrentAccountPkhSelector();
  const saplingAddress = useSaplingAddressSelector();
  const amountToken = useTezosToken(amount);
  const exchangeRate = useAssetExchangeRate(TEZ_TOKEN_SLUG);

  const isUnshield = direction === 'unshield';
  const minusLabel = isUnshield ? 'Shielded TEZ sent' : 'TEZ sent';
  const plusLabel = isUnshield ? 'TEZ received' : 'Shielded TEZ received';

  const formattedAmount = useMemo(
    () => mutezToTz(new BigNumber(amount), TEZ_TOKEN_METADATA.decimals).toFormat(),
    [amount]
  );

  const dollarValue = useMemo(() => {
    if (exchangeRate == null) {
      return null;
    }

    return getDollarValue(amount, TEZ_TOKEN_METADATA.decimals, exchangeRate).toFixed(2);
  }, [amount, exchangeRate]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.infoContainer}>
            <RobotIcon seed={accountPkh} size={formatSize(40)} />
            <Divider size={formatSize(10)} />
            <View>
              <TruncatedText style={styles.description}>{minusLabel}</TruncatedText>
              {isUnshield && !!saplingAddress && (
                <>
                  <Divider size={formatSize(4)} />
                  <PublicKeyHashText publicKeyHash={saplingAddress} />
                </>
              )}
            </View>
          </View>
        </View>
        <View>
          <AssetValueText amount={amount} asset={amountToken} style={styles.amountToken} showMinusSign />
          <Divider size={formatSize(8)} />
          <AssetValueText
            convertToDollar
            amount={amount}
            asset={amountToken}
            style={styles.amountDollar}
            showMinusSign
          />
        </View>
      </View>
      <Divider size={formatSize(8)} />

      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.infoContainer}>
            <RobotIcon seed={accountPkh} size={formatSize(40)} />
            <Divider size={formatSize(10)} />
            <View>
              <TruncatedText style={styles.description}>{plusLabel}</TruncatedText>
              {!isUnshield && !!saplingAddress && (
                <>
                  <Divider size={formatSize(4)} />
                  <PublicKeyHashText publicKeyHash={saplingAddress} />
                </>
              )}
            </View>
          </View>
        </View>
        <View>
          <Text style={[styles.amountToken, { color: colors.adding }]}>+ {formattedAmount} TEZ</Text>
          {dollarValue !== null && (
            <>
              <Divider size={formatSize(8)} />
              <Text style={[styles.amountDollar, { color: colors.adding }]}>≈ + {dollarValue}$</Text>
            </>
          )}
        </View>
      </View>
    </>
  );
};
