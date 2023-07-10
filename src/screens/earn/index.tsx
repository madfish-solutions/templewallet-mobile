import React, { FC, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { useUserFarmingStats } from 'src/hooks/use-user-farming-stats';
import { useUserSavingsStats } from 'src/hooks/use-user-savings-stats';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadAllFarmsAndStakesAction } from 'src/store/farms/actions';
import { useAllFarmsSelector } from 'src/store/farms/selectors';
import { loadAllSavingsAndStakesAction } from 'src/store/savings/actions';
import { useSavingsItemsLoadingSelector } from 'src/store/savings/selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { OpportunityCategoryCard } from './opportunity-category-card';
import { EarnPageSelectors } from './selectors';
import { useEarnPageStyles } from './styles';

export const Earn: FC = () => {
  const dispatch = useDispatch();
  const {
    netApy: farmsNetApy,
    totalStakedAmountInFiat: farmsTotalStakedAmountInFiat,
    maxApy: farmsMaxApy
  } = useUserFarmingStats();
  const {
    netApy: savingsNetApy,
    totalStakedAmountInFiat: savingsTotalStakedAmountInFiat,
    maxApy: savingsMaxApy
  } = useUserSavingsStats();
  const farms = useAllFarmsSelector();
  const savingsLoading = useSavingsItemsLoadingSelector();
  const styles = useEarnPageStyles();

  usePageAnalytic(ScreensEnum.Earn);

  useEffect(() => {
    dispatch(loadAllFarmsAndStakesAction());
    dispatch(loadAllSavingsAndStakesAction());
  }, []);

  return (
    <>
      {farms.isLoading || savingsLoading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <>
          <Divider size={formatSize(8)} />
          <OpportunityCategoryCard
            title="Savings"
            description="Earn passive income and diversify your assets on Tezos."
            screen={ScreensEnum.Savings}
            depositAmountInFiat={savingsTotalStakedAmountInFiat}
            iconName={IconNameEnum.Database}
            netApy={savingsNetApy}
            maxApy={savingsMaxApy}
            testID={EarnPageSelectors.SavingsCard}
          />
          <OpportunityCategoryCard
            title="Farming"
            description="Earn extra rewards by participating in farm."
            screen={ScreensEnum.Farming}
            depositAmountInFiat={farmsTotalStakedAmountInFiat}
            iconName={IconNameEnum.Data}
            netApy={farmsNetApy}
            maxApy={farmsMaxApy}
            testID={EarnPageSelectors.FarmingCard}
          />
        </>
      )}
    </>
  );
};
