import React, { memo, useCallback } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import useSWR from 'swr';

import { templeAdsApi } from 'src/api.service';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';

import { usePromoRewardsCardStyles } from './promo-rewards-card.styles';

interface PromoRewardsResponse {
  allTimeTkey: string;
  lastPaymentTkey?: string;
}

const fetchPromoRewards = (accountPkh: string) =>
  templeAdsApi.get<PromoRewardsResponse>(`/promo-rewards/${accountPkh}`).then(({ data }) => data);

export const PromoRewardsCard = memo(() => {
  const styles = usePromoRewardsCardStyles();
  const isPromoEnabled = useIsPartnersPromoEnabledSelector();
  const accountPkh = useCurrentAccountPkhSelector();
  const navigateToModal = useNavigateToModal();
  const { data, isLoading } = useSWR(
    isPromoEnabled && accountPkh ? ['promo-rewards', accountPkh] : null,
    ([, pkh]) => fetchPromoRewards(pkh),
    { revalidateOnFocus: true }
  );

  const showPayoutInfo = useCallback(
    () => Alert.alert('Promo balance', 'Promo rewards are paid in TKEY at the end of every month.'),
    []
  );
  const openEnableModal = useCallback(() => navigateToModal(ModalsEnum.PromoRewardsEnable), [navigateToModal]);

  if (!isPromoEnabled) {
    return (
      <TouchableOpacity style={styles.root} onPress={openEnableModal} testID="Earn page/Promo rewards card">
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Icon name={IconNameEnum.Deal} size={formatSize(16)} />
            <Text style={styles.title}>Promo rewards</Text>
            <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
          </View>
          <Text style={styles.description}>
            Earn TKEY through built-in Promo content and claim your slice of 20% monthly rewards.
          </Text>
        </View>
        <View style={styles.introFooter}>
          <Text style={styles.introFooterText}>Up to 511 TKEY / month</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.root} testID="Earn page/Promo rewards card">
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Icon name={IconNameEnum.Deal} size={formatSize(16)} />
          <Text style={styles.title}>Promo rewards</Text>
          <TouchableOpacity onPress={showPayoutInfo} accessibilityLabel="Promo rewards payout information">
            <Icon name={IconNameEnum.Info} size={formatSize(16)} />
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <ActivityIndicator style={styles.loader} />
        ) : data ? (
          <>
            <View style={styles.divider} />
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.label}>All time</Text>
                <Text style={styles.value}>{data.allTimeTkey} TKEY</Text>
              </View>
              <View style={[styles.stat, styles.statEnd]}>
                <Text style={styles.label}>Last payment</Text>
                <Text style={styles.positiveValue}>+{data.lastPaymentTkey ?? '0'} TKEY</Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.empty}>Your Promo balance will appear after your first end-of-month payout.</Text>
        )}
      </View>
    </View>
  );
});
