import React, { memo, useMemo } from 'react';
import { Text, View } from 'react-native';

import { ActivityOperTransferType, ActivityStatus } from 'src/activity/types';
import { FormattedAmount } from 'src/components/formatted-amount';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TruncatedText } from 'src/components/truncated-text';
import { useColors } from 'src/styles/use-colors';

import { ActivityAssetImage } from './activity-asset-image';
import { ActivityExplorerLink } from './activity-explorer-link';
import { useActivityOperationRowStyles } from './activity-operation-row.styles';
import { ActivitySpinner } from './activity-spinner';
import { useOpenActivityExplorer } from './hooks/use-open-activity-explorer.hook';
import { ActivityFeedSelectors } from './selectors';
import { ActivityChainRef, ActivityFaceKind, ActivityRowAsset } from './types';
import { getActivityRowAmountView, getActivityTitle } from './utils';

interface Props {
  chainRef: ActivityChainRef;
  kind: ActivityFaceKind;
  transferType?: ActivityOperTransferType;
  isShielded?: boolean;
  hash: string;
  status?: ActivityStatus;
  asset?: ActivityRowAsset;
  fiatRate?: number;
  nftBundleCount?: number;
}

export const ActivityOperationRow = memo<Props>(
  ({ chainRef, kind, transferType, isShielded, hash, status, asset, fiatRate, nftBundleCount }) => {
    const styles = useActivityOperationRowStyles();
    const colors = useColors();

    const title = getActivityTitle(kind, transferType, isShielded);
    const amountView = useMemo(
      () => getActivityRowAmountView(kind, asset, fiatRate, nftBundleCount),
      [kind, asset, fiatRate, nftBundleCount]
    );
    const { url, handlePress } = useOpenActivityExplorer(chainRef, hash);
    const testIDProperties = useMemo(() => ({ chain: chainRef.chain }), [chainRef.chain]);

    const amountTextStyle = useMemo(
      () => [styles.amountText, amountView.isPositive ? styles.positiveAmountText : undefined],
      [styles, amountView.isPositive]
    );

    return (
      <TouchableWithAnalytics
        Component={SafeTouchableOpacity}
        style={styles.container}
        disabled={url == null}
        onPress={handlePress}
        testID={ActivityFeedSelectors.activityItem}
        testIDProperties={testIDProperties}
      >
        <ActivityAssetImage
          chain={chainRef.chain}
          kind={kind}
          transferType={transferType}
          source={asset?.image}
          isNft={asset?.isNft}
        />

        <View style={styles.infoContainer}>
          <View style={styles.line}>
            <View style={styles.titleContainer}>
              {isShielded === true && (
                <IconV2 name={IconNameV2Enum.Shield} size={16} color={colors.gray1} style={styles.shieldIcon} />
              )}
              <Text style={styles.titleText}>{title}</Text>

              <View style={styles.statusContainer}>
                {status === ActivityStatus.pending ? <ActivitySpinner size={16} /> : null}
              </View>
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
            <ActivityExplorerLink chain={chainRef.chain} hash={hash} url={url} onPress={handlePress} />

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
        </View>
      </TouchableWithAnalytics>
    );
  }
);
