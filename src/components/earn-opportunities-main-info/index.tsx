import { BigNumber } from 'bignumber.js';
import { noop } from 'lodash-es';
import React, { memo } from 'react';
import { View, Text } from 'react-native';

import { Button } from 'src/components/button/button';
import { Divider } from 'src/components/divider/divider';
import { PERCENTAGE_DECIMALS } from 'src/config/earn-opportunities';
import { DEFAULT_AMOUNT, PENNY } from 'src/config/earn-opportunities-main-info';
import { useCurrentFiatCurrencyMetadataSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { formatOptionalPercentage } from 'src/utils/earn-opportunities/format.utils';

import { OptionalFormattedAmount } from '../optional-formatted-amount';

import { useEarnOpportunitiesMainInfoStyles, useButtonPrimaryStyleConfig } from './styles';

interface Props {
  claimAllRewards?: EmptyFn;
  shouldShowClaimRewardsButton?: boolean;
  totalClaimableRewardsInFiat?: BigNumber;
  netApr?: BigNumber;
  totalStakedAmountInFiat?: BigNumber;
  areRewardsClaimable?: boolean;
}

export const EarnOpportunitiesMainInfo = memo<Props>(
  ({
    claimAllRewards = noop,
    shouldShowClaimRewardsButton = false,
    totalClaimableRewardsInFiat = DEFAULT_AMOUNT,
    netApr,
    totalStakedAmountInFiat,
    areRewardsClaimable = false
  }) => {
    const styles = useEarnOpportunitiesMainInfoStyles();
    const buttonPrimaryStylesConfig = useButtonPrimaryStyleConfig();
    const { symbol: fiatSymbol } = useCurrentFiatCurrencyMetadataSelector();
    const roundingMode = totalClaimableRewardsInFiat?.isLessThan(PENNY) ? BigNumber.ROUND_UP : undefined;

    return (
      <View style={styles.root}>
        <View>
          <View style={styles.container}>
            <View style={[styles.card, styles.deposit]}>
              <Text style={styles.titleText}>CURRENT DEPOSIT AMOUNT</Text>
              <OptionalFormattedAmount isDollarValue amount={totalStakedAmountInFiat} style={styles.valueText} />
            </View>
            <Divider size={formatSize(8)} />
            <View style={[styles.card, styles.netApr]}>
              <Text style={styles.titleText}>NET APR</Text>
              <Text style={styles.valueText}>{formatOptionalPercentage(netApr)}</Text>
            </View>
          </View>
          {shouldShowClaimRewardsButton && (
            <>
              <Divider size={formatSize(16)} />
              <Button
                styleConfig={buttonPrimaryStylesConfig}
                title={
                  areRewardsClaimable
                    ? `CLAIM ALL ≈ ${totalClaimableRewardsInFiat.toFixed(
                        PERCENTAGE_DECIMALS,
                        roundingMode
                      )}${fiatSymbol}`
                    : 'EARN TO CLAIM REWARDS'
                }
                disabled={!areRewardsClaimable}
                onPress={claimAllRewards}
              />
            </>
          )}
        </View>
      </View>
    );
  }
);
