import { noop } from 'lodash-es';
import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Bage } from 'src/components/bage/bage';
import { Button } from 'src/components/button/button';
import { Divider } from 'src/components/divider/divider';
import { EarnOpportunityTokens } from 'src/components/earn-opportunity-tokens';
import { FormattedAmount } from 'src/components/formatted-amount';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { EmptyFn } from 'src/config/general';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { useEarnOpportunityTokens } from 'src/hooks/use-earn-opportunity-tokens';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { EarnOpportunity } from 'src/types/earn-opportunity.type';
import { SECONDS_IN_DAY } from 'src/utils/date.utils';
import { aprToApy, isFarm } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';

import { StatsItem } from './stats-item';
import { useButtonPrimaryStyleConfig, useButtonSecondaryStyleConfig, useEarnOpportunityItemStyles } from './styles';
import { useAmounts } from './use-amounts';

interface Props {
  item: EarnOpportunity;
  lastStakeRecord?: UserStakeValueInterface;
  navigateToOpportunity: EmptyFn;
  harvestRewards?: EmptyFn;
}

const PERCENTAGE_DECIMALS = 2;

export const EarnOpportunityItem: FC<Props> = ({
  item,
  lastStakeRecord,
  navigateToOpportunity,
  harvestRewards = noop
}) => {
  const { apr, stakedToken, depositExchangeRate, earnExchangeRate, type: itemType, vestingPeriodSeconds } = item;
  const colors = useColors();
  const styles = useEarnOpportunityItemStyles();
  const buttonPrimaryStylesConfig = useButtonPrimaryStyleConfig();
  const buttonSecondaryStylesConfig = useButtonSecondaryStyleConfig();
  const { stakeTokens, rewardToken } = useEarnOpportunityTokens(item);
  const itemIsFarm = isFarm(item);

  const formattedApr = useMemo(() => (isDefined(apr) ? Number(apr).toFixed(PERCENTAGE_DECIMALS) : '---'), [apr]);
  const apy = useMemo(() => (isDefined(apr) ? aprToApy(Number(apr)).toFixed(PERCENTAGE_DECIMALS) : '---'), [apr]);

  const { amount: depositAmount, fiatEquivalent: depositFiatEquivalent } = useAmounts(
    lastStakeRecord?.depositAmountAtomic,
    stakedToken.metadata.decimals,
    depositExchangeRate
  );
  const depositIsZero = depositAmount.isZero();

  const { amount: claimableRewardsAmount, fiatEquivalent: claimableRewardsFiatEquivalent } = useAmounts(
    lastStakeRecord?.claimableRewards,
    rewardToken.decimals,
    earnExchangeRate
  );

  return (
    <View style={[styles.root, styles.mb16]}>
      <View style={styles.bageContainer}>
        {itemType === EarnOpportunityTypeEnum.STABLESWAP && (
          <Bage text="Stable Pool" color={colors.kolibriGreen} style={styles.bage} />
        )}
        {Number(vestingPeriodSeconds) > SECONDS_IN_DAY && <Bage text="Long-Term Farm" />}
      </View>
      <View style={styles.mainContent}>
        <View style={[styles.tokensContainer, styles.row]}>
          <EarnOpportunityTokens stakeTokens={stakeTokens} rewardToken={rewardToken} />
          <View>
            <Text style={styles.apyText}>
              {itemType === EarnOpportunityTypeEnum.YOUVES_SAVING || itemType === EarnOpportunityTypeEnum.YOUVES_STAKING
                ? `APR: ${formattedApr}%`
                : `APY: ${apy}%`}
            </Text>
            <View style={styles.earnSource}>
              <Icon
                style={styles.earnSourceIcon}
                size={formatSize(12)}
                name={itemIsFarm ? IconNameEnum.QsEarnSource : IconNameEnum.YouvesEarnSource}
              />
              <Text style={styles.attributeTitle}>{itemIsFarm ? 'Quipuswap' : 'Youves'}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.row, styles.mb16]}>
          <StatsItem
            title="Your deposit:"
            value={
              itemIsFarm ? (
                <FormattedAmount isDollarValue amount={depositFiatEquivalent} style={styles.attributeValue} />
              ) : (
                <FormattedAmount
                  symbol={stakedToken.metadata.symbol}
                  amount={depositAmount}
                  style={styles.attributeValue}
                />
              )
            }
            loading={false}
            fiatEquivalent={itemIsFarm ? undefined : depositFiatEquivalent}
          />
          <StatsItem
            title="Claimable rewards:"
            value={
              itemIsFarm ? (
                <FormattedAmount isDollarValue amount={claimableRewardsFiatEquivalent} style={styles.attributeValue} />
              ) : (
                <FormattedAmount
                  symbol={rewardToken.symbol}
                  amount={claimableRewardsAmount}
                  style={styles.attributeValue}
                />
              )
            }
            loading={false}
            fiatEquivalent={itemIsFarm ? undefined : claimableRewardsFiatEquivalent}
          />
        </View>

        <View style={styles.row}>
          {!depositIsZero && (
            <View style={styles.flex}>
              <Button
                title="MANAGE"
                isFullWidth
                onPress={navigateToOpportunity}
                styleConfig={buttonSecondaryStylesConfig}
              />
            </View>
          )}
          {!depositIsZero && itemIsFarm && (
            <>
              <Divider size={formatSize(8)} />
              <View style={styles.flex}>
                <Button
                  isFullWidth
                  title="CLAIM REWARDS"
                  onPress={harvestRewards}
                  styleConfig={buttonPrimaryStylesConfig}
                />
              </View>
            </>
          )}
          {depositIsZero && (
            <Button
              isFullWidth
              title={itemIsFarm ? 'START FARMING' : 'START EARNING'}
              onPress={navigateToOpportunity}
              styleConfig={buttonPrimaryStylesConfig}
            />
          )}
        </View>
      </View>
    </View>
  );
};
