import { BigNumber } from 'bignumber.js';
import React, { FC, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { useUserFarmingStats } from 'src/hooks/use-user-farming-stats';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadAllFarmsAndStakesAction } from 'src/store/farms/actions';
import { useAllFarmsSelector } from 'src/store/farms/selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { OpportunityCategoryCard } from './opportunity-category-card';
import { EarnPageSelectors } from './selectors';
import { useEarnPageStyles } from './styles';

const MOCK_SAVINGS_AMOUNT = new BigNumber(0);
const MOCK_SAVINGS_APY = new BigNumber(24.99);

export const Earn: FC = () => {
  const dispatch = useDispatch();
  const { netApy, totalStakedAmountInUsd, maxApy } = useUserFarmingStats();
  const farms = useAllFarmsSelector();
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
        <>
          <Divider size={formatSize(8)} />
          <OpportunityCategoryCard
            title="Savings"
            description="Earn passive income and diversify your assets on Tezos."
            screen={ScreensEnum.Savings}
            depositAmount={MOCK_SAVINGS_AMOUNT}
            iconName={IconNameEnum.Database}
            netApy={MOCK_SAVINGS_APY}
            maxApy={MOCK_SAVINGS_APY}
            testID={EarnPageSelectors.SavingsCard}
          />
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
        </>
      )}
    </>
  );
};
