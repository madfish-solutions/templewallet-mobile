import React, { FC, memo, PropsWithChildren, useCallback } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { useTkeyRewardsStats } from 'src/hooks/use-tkey-rewards-stats.hook';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { formatSize } from 'src/styles/format-size';
import { formatAssetAmount, ZERO } from 'src/utils/number.util';

import { usePromoRewardsCardStyles } from './styles';

export const PromoRewardsCard = memo(() => {
  const styles = usePromoRewardsCardStyles();
  const isPromoEnabled = useIsPartnersPromoEnabledSelector();
  const navigateToModal = useNavigateToModal();
  const { isLoading, stats } = useTkeyRewardsStats();

  const openEnableModal = useCallback(() => navigateToModal(ModalsEnum.PromoRewardsEnable), [navigateToModal]);

  if (!isPromoEnabled) {
    return (
      <PromoRewardsCardFrame key="promo-rewards-card-clickable">
        <TouchableOpacity style={styles.card} onPress={openEnableModal} testID="Earn page/Promo rewards card">
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Icon name={IconNameEnum.Reward} />
              <Text style={styles.title}>Promo rewards</Text>
              <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
            </View>
            <Text style={styles.description}>
              Earn TKEY token through built-in promo feature and claim your slice of 20% monthly rewards.
            </Text>
          </View>
          <View style={styles.introFooter}>
            <Text style={styles.introFooterText}>Up to 511 TKEY / month</Text>
          </View>
        </TouchableOpacity>
      </PromoRewardsCardFrame>
    );
  }

  return (
    <PromoRewardsCardFrame key="promo-rewards-card" reversed>
      <View style={styles.card}>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Icon name={IconNameEnum.Reward} />
            <Text style={styles.title}>Promo rewards</Text>
            {(!stats || stats.total.isZero()) && (
              <TouchableOpacity onPress={showPayoutInfo}>
                <Icon name={IconNameEnum.InfoFilledAlt} />
              </TouchableOpacity>
            )}
          </View>
          {isLoading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" />
            </View>
          ) : (
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.label}>All time:</Text>
                <Text style={styles.value}>{formatAssetAmount(stats?.total ?? ZERO, 2)} TKEY</Text>
              </View>
              <View style={[styles.stat, styles.statEnd]}>
                <Text style={styles.label}>Last payment:</Text>
                <Text style={styles.positiveValue}>+{formatAssetAmount(stats?.lastAmount ?? ZERO, 2)} TKEY</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </PromoRewardsCardFrame>
  );
});

interface PromoRewardsCardFrameProps extends PropsWithChildren {
  reversed?: boolean;
}

const PromoRewardsCardFrame: FC<PromoRewardsCardFrameProps> = ({ children, reversed = false }) => {
  const styles = usePromoRewardsCardStyles();

  return (
    <View style={styles.root}>
      <Svg pointerEvents="none" style={styles.borderGradient} width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="promoRewardsBorder" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={reversed ? '#FF5B00' : '#FFD600'} />
            <Stop offset="100%" stopColor={reversed ? '#FFD600' : '#FF5B00'} />
          </LinearGradient>
        </Defs>
        <Rect
          x="0.5%"
          y="0.5%"
          width="99%"
          height="99%"
          rx={formatSize(8)}
          ry={formatSize(8)}
          fill="none"
          stroke="url(#promoRewardsBorder)"
          strokeWidth={formatSize(1)}
        />
      </Svg>
      {children}
    </View>
  );
};

const showPayoutInfo = () =>
  Alert.alert(
    'Promo rewards',
    'This section display display your rewards for Promo. You can manage this feature in the Settings.'
  );
