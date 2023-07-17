import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { useThemeSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { EarnOpportunity } from 'src/types/earn-opportunity.type';
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

export const DetailsSection: FC<Props> = ({ earnOpportunityItem, stake, shouldShowClaimRewardsButton, loading }) => {
  const theme = useThemeSelector();
  const styles = useDetailsSectionStyles();

  return (
    <>
      <View style={styles.detailsTitle}>
        {earnOpportunityItem.type === EarnOpportunityTypeEnum.STABLESWAP && (
          <View style={styles.farmTypeIconWrapper}>
            <Icon
              name={theme === ThemesEnum.dark ? IconNameEnum.QuipuSwapDark : IconNameEnum.QuipuSwap}
              size={formatSize(16)}
            />
          </View>
        )}
        {youvesSavingsTypes.includes(earnOpportunityItem.type ?? EarnOpportunityTypeEnum.DEX_TWO) && (
          <View style={styles.youvesIconWrapper}>
            <Icon name={IconNameEnum.YouvesEarnSourceLarge} size={formatSize(24)} />
          </View>
        )}
        <Divider size={formatSize(8)} />
        <Text style={styles.detailsTitleText}>
          {isFarm(earnOpportunityItem) ? 'Quipuswap Farming Details' : 'Youves Savings Details'}
        </Text>
      </View>

      <Divider size={formatSize(16)} />

      <DetailsCard
        earnOpportunityItem={earnOpportunityItem}
        stake={stake}
        shouldShowClaimRewardsButton={shouldShowClaimRewardsButton}
        loading={loading}
      />
    </>
  );
};
