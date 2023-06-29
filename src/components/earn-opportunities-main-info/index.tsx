import { BigNumber } from 'bignumber.js';
import { noop } from 'lodash-es';
import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { Button } from 'src/components/button/button';
import { Divider } from 'src/components/divider/divider';
import { FormattedAmount } from 'src/components/formatted-amount';
import { EmptyFn } from 'src/config/general';
import { formatSize } from 'src/styles/format-size';

import { DEFAULT_AMOUNT, DEFAULT_DECIMALS, PENNY } from './constants';
import { useEarnOpportunitiesMainInfoStyles, useButtonPrimaryStyleConfig } from './styles';

interface Props {
  claimAllRewards?: EmptyFn;
  shouldShowClaimRewardsButton?: boolean;
  totalClaimableRewardsInUsd?: BigNumber;
  netApy: BigNumber;
  totalStakedAmountInFiat: BigNumber;
}

export const EarnOpportunitiesMainInfo: FC<Props> = ({
  claimAllRewards = noop,
  shouldShowClaimRewardsButton = false,
  totalClaimableRewardsInUsd = DEFAULT_AMOUNT,
  netApy,
  totalStakedAmountInFiat
}) => {
  const styles = useEarnOpportunitiesMainInfoStyles();
  const buttonPrimaryStylesConfig = useButtonPrimaryStyleConfig();
  const areSomeRewardsClaimable = totalClaimableRewardsInUsd.isGreaterThan(PENNY);

  return (
    <View style={styles.root}>
      <View>
        <View style={styles.container}>
          <View style={[styles.card, styles.deposit]}>
            <Text style={styles.titleText}>CURRENT DEPOSIT AMOUNT</Text>
            <FormattedAmount isDollarValue amount={totalStakedAmountInFiat} style={styles.valueText} />
          </View>
          <Divider size={formatSize(8)} />
          <View style={[styles.card, styles.netApy]}>
            <Text style={styles.titleText}>NET APY</Text>
            <Text style={styles.valueText}>{netApy.toFixed(DEFAULT_DECIMALS)}%</Text>
          </View>
        </View>
        {shouldShowClaimRewardsButton && (
          <>
            <Divider size={formatSize(16)} />
            <Button
              styleConfig={buttonPrimaryStylesConfig}
              title={
                areSomeRewardsClaimable
                  ? `CLAIM ALL ≈ ${totalClaimableRewardsInUsd.toFixed(DEFAULT_DECIMALS)}$`
                  : 'EARN TO CLAIM REWARDS'
              }
              disabled={!areSomeRewardsClaimable}
              onPress={claimAllRewards}
            />
          </>
        )}
      </View>
    </View>
  );
};
