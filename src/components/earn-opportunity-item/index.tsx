import { noop } from 'lodash-es';
import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Bage } from 'src/components/bage/bage';
import { Button } from 'src/components/button/button';
import { Divider } from 'src/components/divider/divider';
import { EarnOpportunityTokens } from 'src/components/earn-opportunity-tokens';
import { HorizontalBorder } from 'src/components/horizontal-border';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PERCENTAGE_DECIMALS } from 'src/config/earn-opportunities';
import { EmptyFn } from 'src/config/general';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { useEarnOpportunityTokens } from 'src/hooks/use-earn-opportunity-tokens';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { useThemeSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { KNOWN_STABLECOINS_SLUGS } from 'src/token/data/token-slugs';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { EarnOpportunity } from 'src/types/earn-opportunity.type';
import { SECONDS_IN_DAY } from 'src/utils/date.utils';
import { isFarm } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';

import { EarnOpportunityItemSelectors } from './selectors';
import { StatsItem } from './stats-item';
import { useButtonPrimaryStyleConfig, useButtonSecondaryStyleConfig, useEarnOpportunityItemStyles } from './styles';
import { useAmounts } from './use-amounts';

interface Props {
  item: EarnOpportunity;
  lastStakeRecord?: UserStakeValueInterface;
  navigateToOpportunity: EmptyFn;
  harvestRewards?: EmptyFn;
  stakeIsLoading: boolean;
}

export const EarnOpportunityItem: FC<Props> = ({
  item,
  lastStakeRecord,
  navigateToOpportunity,
  harvestRewards = noop,
  stakeIsLoading
}) => {
  const {
    apr,
    stakedToken,
    depositExchangeRate,
    earnExchangeRate,
    type: itemType,
    vestingPeriodSeconds,
    id,
    contractAddress
  } = item;
  const colors = useColors();
  const theme = useThemeSelector();
  const styles = useEarnOpportunityItemStyles();
  const buttonPrimaryStylesConfig = useButtonPrimaryStyleConfig();
  const buttonSecondaryStylesConfig = useButtonSecondaryStyleConfig();
  const { stakeTokens, rewardToken } = useEarnOpportunityTokens(item);
  const itemIsFarm = isFarm(item);
  const isLiquidityBaking = itemType === EarnOpportunityTypeEnum.LIQUIDITY_BAKING;
  const allTokensAreStablecoins = useMemo(
    () =>
      item.tokens.every(token =>
        KNOWN_STABLECOINS_SLUGS.includes(toTokenSlug(token.contractAddress, token.fa2TokenId))
      ),
    [item.tokens]
  );
  const youvesIconName = theme === ThemesEnum.light ? IconNameEnum.YouvesEarnSource : IconNameEnum.YouvesEarnSourceDark;

  const formattedApr = useMemo(() => (isDefined(apr) ? Number(apr).toFixed(PERCENTAGE_DECIMALS) : '---'), [apr]);

  const depositAmounts = useAmounts(
    lastStakeRecord?.depositAmountAtomic,
    stakedToken.metadata.decimals,
    depositExchangeRate
  );
  const { amount: depositAmount } = depositAmounts;
  const depositIsZero = depositAmount.isZero();

  const claimableRewardsAmounts = useAmounts(lastStakeRecord?.claimableRewards, rewardToken.decimals, earnExchangeRate);

  const actionButtonsTestIDProperties = useMemo(
    () => ({
      id,
      contractAddress
    }),
    [id, contractAddress]
  );

  return (
    <View style={[styles.root, styles.mb16]}>
      <View style={styles.bageContainer}>
        {(itemType === EarnOpportunityTypeEnum.STABLESWAP || (allTokensAreStablecoins && !itemIsFarm)) && (
          <Bage text="Stable Pool" color={colors.kolibriGreen} style={styles.bage} textStyle={styles.bageText} />
        )}
        {Number(vestingPeriodSeconds) > SECONDS_IN_DAY && (
          <Bage
            text={itemIsFarm ? 'Long-Term Farm' : 'Long-Term Savings Pool'}
            style={[styles.bage, styles.lastBage]}
            textStyle={styles.bageText}
          />
        )}
      </View>
      <View style={styles.mainContent}>
        <View style={[styles.tokensContainer, styles.row]}>
          <EarnOpportunityTokens stakeTokens={stakeTokens} rewardToken={rewardToken} />
          <View>
            <Text style={styles.aprText}>APR: {formattedApr}%</Text>
            <View style={styles.earnSource}>
              {isLiquidityBaking ? (
                <View style={[styles.earnSourceIcon, styles.liquidityBakingIconWrapper]}>
                  <Icon size={formatSize(6)} name={IconNameEnum.LiquidityBakingLogo} />
                </View>
              ) : (
                <Icon
                  style={styles.earnSourceIcon}
                  size={formatSize(12)}
                  name={itemIsFarm ? IconNameEnum.QsEarnSource : youvesIconName}
                />
              )}
              <Text style={styles.attributeTitle}>
                {isLiquidityBaking && 'Liquidity Baking'}
                {!isLiquidityBaking && itemIsFarm && 'Quipuswap'}
                {!itemIsFarm && 'Youves'}
              </Text>
            </View>
          </View>
        </View>

        <HorizontalBorder />

        <Divider size={formatSize(8)} />

        <View style={[styles.row, styles.mb16]}>
          <StatsItem
            title="Your deposit:"
            amounts={depositAmounts}
            isLoading={stakeIsLoading}
            fiatEquivalentIsMain={itemIsFarm}
            tokenSymbol={stakedToken.metadata.symbol}
          />
          {!depositIsZero && !isLiquidityBaking && (
            <StatsItem
              title="Claimable rewards:"
              amounts={claimableRewardsAmounts}
              isLoading={stakeIsLoading}
              fiatEquivalentIsMain={itemIsFarm}
              tokenSymbol={rewardToken.symbol}
            />
          )}
        </View>

        <View style={styles.row}>
          {!depositIsZero && (
            <View style={styles.flex}>
              <Button
                title="MANAGE"
                isFullWidth
                onPress={navigateToOpportunity}
                styleConfig={buttonSecondaryStylesConfig}
                testID={EarnOpportunityItemSelectors.ManageButton}
                testIDProperties={actionButtonsTestIDProperties}
              />
            </View>
          )}
          {!depositIsZero && itemIsFarm && !isLiquidityBaking && (
            <>
              <Divider size={formatSize(8)} />
              <View style={styles.flex}>
                <Button
                  isFullWidth
                  title="CLAIM REWARDS"
                  onPress={harvestRewards}
                  styleConfig={buttonPrimaryStylesConfig}
                  testID={EarnOpportunityItemSelectors.ClaimRewardsButton}
                  testIDProperties={actionButtonsTestIDProperties}
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
              testID={EarnOpportunityItemSelectors.StartFarmingButton}
              testIDProperties={actionButtonsTestIDProperties}
            />
          )}
        </View>
      </View>
    </View>
  );
};
