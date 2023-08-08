import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { FarmPoolTypeEnum } from 'src/enums/farm-pool-type.enum';
import { UserStakeValueInterface } from 'src/store/farms/state';
import { formatSize } from 'src/styles/format-size';
import { Farm } from 'src/types/farm';

import { DetailsCard } from '../details-card';
import { useDetailsSectionStyles } from './styles';

interface Props {
  farm: Farm;
  stake?: UserStakeValueInterface;
  shouldShowClaimRewardsButton: boolean;
  loading: boolean;
}

export const DetailsSection: FC<Props> = ({ farm, stake, shouldShowClaimRewardsButton, loading }) => {
  const styles = useDetailsSectionStyles();

  return (
    <>
      <View style={styles.detailsTitle}>
        {farm.type === FarmPoolTypeEnum.STABLESWAP && (
          <View style={[styles.farmTypeIconWrapper, styles.quipuswapIconWrapper]}>
            <Icon name={IconNameEnum.QuipuSwap} size={formatSize(16)} />
          </View>
        )}
        {farm.type === FarmPoolTypeEnum.LIQUIDITY_BAKING && (
          <View style={[styles.farmTypeIconWrapper, styles.liquidityBakingIconWrapper]}>
            <Icon name={IconNameEnum.LiquidityBakingLogo} size={formatSize(16)} />
          </View>
        )}
        <Divider size={formatSize(8)} />
        <Text style={styles.detailsTitleText}>
          {farm.type === FarmPoolTypeEnum.LIQUIDITY_BAKING ? 'Liquidity Baking Details' : 'Quipuswap Farming Details'}
        </Text>
      </View>

      <Divider size={formatSize(16)} />

      <DetailsCard
        farm={farm}
        stake={stake}
        shouldShowClaimRewardsButton={shouldShowClaimRewardsButton}
        loading={loading}
      />
    </>
  );
};
