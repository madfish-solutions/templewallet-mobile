import React, { memo, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { formatSize } from 'src/styles/format-size';
import { EarnOpportunity } from 'src/types/earn-opportunity.types';
import { isFarm } from 'src/utils/earn.utils';

import { DetailsCard } from '../details-card';

import { useDetailsSectionStyles } from './styles';

interface Props {
  earnOpportunityItem: EarnOpportunity;
  stake?: UserStakeValueInterface;
  shouldShowClaimRewardsButton: boolean;
  loading: boolean;
}

const youvesSavingsTypes = [EarnOpportunityTypeEnum.YOUVES_SAVING, EarnOpportunityTypeEnum.YOUVES_STAKING];

export const DetailsSection = memo<Props>(({ earnOpportunityItem, stake, shouldShowClaimRewardsButton, loading }) => {
  const styles = useDetailsSectionStyles();
  const isLiquidityBaking = earnOpportunityItem.type === EarnOpportunityTypeEnum.LIQUIDITY_BAKING;
  const isKordFi = earnOpportunityItem.type === EarnOpportunityTypeEnum.KORD_FI_SAVING;

  const savingDetailsText = useMemo(() => {
    let appName = '';

    switch (earnOpportunityItem.type) {
      case EarnOpportunityTypeEnum.KORD_FI_SAVING:
        appName = 'Kord.Fi';
        break;
      case EarnOpportunityTypeEnum.YOUVES_SAVING:
      case EarnOpportunityTypeEnum.YOUVES_STAKING:
        appName = 'Youves';
        break;
    }

    return `${appName} Savings Details`;
  }, [earnOpportunityItem.type]);

  return (
    <>
      <View style={styles.detailsTitle}>
        {earnOpportunityItem.type === EarnOpportunityTypeEnum.STABLESWAP && (
          <View style={styles.farmTypeIconWrapper}>
            <Icon name={IconNameEnum.QuipuSwap} size={formatSize(16)} />
          </View>
        )}
        {earnOpportunityItem.type === EarnOpportunityTypeEnum.LIQUIDITY_BAKING && (
          <View style={[styles.farmTypeIconWrapper, styles.liquidityBakingIconWrapper]}>
            <Icon name={IconNameEnum.LiquidityBakingLogo} size={formatSize(16)} />
          </View>
        )}
        {youvesSavingsTypes.includes(earnOpportunityItem.type ?? EarnOpportunityTypeEnum.DEX_TWO) && (
          <View style={styles.youvesIconWrapper}>
            <Icon name={IconNameEnum.YouvesEarnSourceLarge} size={formatSize(24)} />
          </View>
        )}
        {isKordFi && (
          <View style={styles.youvesIconWrapper}>
            <Icon name={IconNameEnum.KordFiEarnSource} size={formatSize(24)} />
          </View>
        )}
        <Divider size={formatSize(8)} />
        <Text style={styles.detailsTitleText}>
          {isLiquidityBaking && 'Liquidity Baking Details'}
          {!isLiquidityBaking && isFarm(earnOpportunityItem) && 'Quipuswap Farming Details'}
          {!isFarm(earnOpportunityItem) && savingDetailsText}
        </Text>
      </View>

      <Divider size={formatSize(16)} />

      <DetailsCard
        earnOpportunityItem={earnOpportunityItem}
        stake={stake}
        shouldShowClaimRewardsButton={shouldShowClaimRewardsButton}
        loading={loading}
        isNeedToShowMoreDetails={earnOpportunityItem.type !== EarnOpportunityTypeEnum.KORD_FI_SAVING}
      />
    </>
  );
});
