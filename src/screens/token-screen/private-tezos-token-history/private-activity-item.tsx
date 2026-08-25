import React, { memo, useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { ActivityOperKindEnum, ActivityOperTransferType } from 'src/activity/types';
import { ActivityAssetImage } from 'src/components/activity-feed/activity-asset-image';
import { useActivityOperationRowStyles } from 'src/components/activity-feed/activity-operation-row.styles';
import { useTezosActivityAsset } from 'src/components/activity-feed/hooks/use-tezos-activity-asset.hook';
import { getActivityRowAmountView, getActivityTitle, shortenHash } from 'src/components/activity-feed/utils';
import { FormattedAmount } from 'src/components/formatted-amount';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TruncatedText } from 'src/components/truncated-text';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { SaplingTransactionHistoryItem } from 'src/interfaces/sapling-service.interface';
import { useColors } from 'src/styles/use-colors';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';

import { usePrivateActivityItemStyles } from './private-activity-item.styles';

interface Props {
  transaction: SaplingTransactionHistoryItem;
}

export const PrivateActivityItem = memo<Props>(({ transaction }) => {
  const styles = useActivityOperationRowStyles();
  const privateStyles = usePrivateActivityItemStyles();
  const colors = useColors();

  const isIncoming = transaction.type === 'incoming';
  const transferType = isIncoming
    ? ActivityOperTransferType.receiveFromAccount
    : ActivityOperTransferType.sendToAccount;
  const signedValue = isIncoming ? transaction.value : `-${transaction.value}`;

  const { asset, fiatRate } = useTezosActivityAsset(TEZ_TOKEN_SLUG, signedValue);
  const amountView = useMemo(
    () => getActivityRowAmountView(ActivityOperKindEnum.transfer, asset, fiatRate),
    [asset, fiatRate]
  );

  const title = getActivityTitle(ActivityOperKindEnum.transfer, transferType);

  const handleCopyAddress = useCallback(
    () => copyStringToClipboard(transaction.paymentAddress),
    [transaction.paymentAddress]
  );

  const amountTextStyle = useMemo(
    () => [styles.amountText, amountView.isPositive ? styles.positiveAmountText : undefined],
    [styles, amountView.isPositive]
  );

  return (
    <TouchableWithAnalytics
      Component={TouchableOpacity}
      style={styles.container}
      onPress={handleCopyAddress}
      testID="PrivateTezosTokenHistory/ActivityItem"
    >
      <ActivityAssetImage
        chain={TempleChainKind.Tezos}
        kind={ActivityOperKindEnum.transfer}
        transferType={transferType}
        source={asset?.image}
      />

      <View style={styles.infoContainer}>
        <View style={styles.line}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{title}</Text>
          </View>

          <View style={[styles.rightContainer, styles.amountContainer]}>
            {amountView.amountText == null ? null : (
              <TruncatedText style={amountTextStyle}>{amountView.amountText}</TruncatedText>
            )}

            {amountView.symbolText == null ? null : (
              <Text style={[amountTextStyle, styles.symbolText]}>{` ${amountView.symbolText}`}</Text>
            )}
          </View>
        </View>

        <View style={styles.line}>
          <View style={privateStyles.addressContainer}>
            <Text style={privateStyles.addressText}>{shortenHash(transaction.paymentAddress)}</Text>
            <IconV2 name={IconNameV2Enum.Copy} size={12} color={colors.blue} />
          </View>

          <View style={styles.rightContainer}>
            {amountView.fiatValue == null ? (
              amountView.noteText == null ? null : (
                <TruncatedText style={styles.noteText}>{amountView.noteText}</TruncatedText>
              )
            ) : (
              <FormattedAmount
                numberOfLines={1}
                amount={amountView.fiatValue}
                isDollarValue={true}
                hideApproximateSign={true}
                showAllDecimalPlaces={true}
                showMinusSign={amountView.fiatValue.isLessThan(0)}
                showPlusSign={amountView.fiatValue.isGreaterThan(0)}
                style={styles.noteText}
              />
            )}
          </View>
        </View>

        {/* TODO: move later to the correct place */}
        {/*{transaction.memo ? (*/}
        {/*  <TruncatedText style={privateStyles.memoText}>{`Memo: ${transaction.memo}`}</TruncatedText>*/}
        {/*) : null}*/}
      </View>
    </TouchableWithAnalytics>
  );
});
