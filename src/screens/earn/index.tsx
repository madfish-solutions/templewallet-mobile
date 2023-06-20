import React, { FC, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { useUserFarmingStats } from 'src/hooks/use-user-farming-stats';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadAllFarmsAndStakesAction } from 'src/store/farms/actions';
import { useAllFarmsSelector /* , useLastStakesSelector */ } from 'src/store/farms/selectors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { OpportunityCategoryCard } from './opportunity-category-card';
import { EarnPageSelectors } from './selectors';
import { useEarnPageStyles } from './styles';

export const Earn: FC = () => {
  const dispatch = useDispatch();
  const { netApy, totalStakedAmountInUsd, maxApy } = useUserFarmingStats();
  const farms = useAllFarmsSelector();
  // const stakes = useLastStakesSelector();
  const styles = useEarnPageStyles();

  usePageAnalytic(ScreensEnum.Earn);

  useEffect(() => {
    dispatch(loadAllFarmsAndStakesAction());
  }, []);

  return (
    <>
      {Boolean(farms.isLoading) ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <OpportunityCategoryCard
          title="Farming"
          description="Earn extra rewards by participating in farm."
          screen={ScreensEnum.Farming}
          depositAmount={totalStakedAmountInUsd}
          iconName={IconNameEnum.Data}
          netApy={netApy}
          maxApy={maxApy}
          testID={EarnPageSelectors.FarmingCard}
        />
      )}
    </>
  );
};
