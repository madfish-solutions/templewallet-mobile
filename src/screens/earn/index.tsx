import React, { FC } from 'react';

import { Divider } from 'src/components/divider/divider';
import { DeadEndBoundaryError } from 'src/components/error-boundary';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { APR_REFRESH_INTERVAL } from 'src/config/fixed-times';
import { useUserFarmingStats } from 'src/hooks/use-user-farming-stats';
import { useUserSavingsStats } from 'src/hooks/use-user-savings-stats';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { dispatch } from 'src/store';
import { loadAllFarmsAndStakesAction } from 'src/store/farms/actions';
import { loadAllSavingsAndStakesAction } from 'src/store/savings/actions';
import { useAccountAddressForTezos } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { useInterval } from 'src/utils/hooks/use-interval';

import { OpportunityCategoryCard } from './opportunity-category-card';
import { EarnPageSelectors } from './selectors';

export const Earn: FC = () => {
  const tezosAddress = useAccountAddressForTezos();

  if (!tezosAddress) {
    throw new DeadEndBoundaryError();
  }

  const {
    netApr: farmsNetApr,
    totalStakedAmountInFiat: farmsTotalStakedAmountInFiat,
    maxApr: farmsMaxApr
  } = useUserFarmingStats();
  const {
    netApr: savingsNetApr,
    totalStakedAmountInFiat: savingsTotalStakedAmountInFiat,
    maxApr: savingsMaxApr
  } = useUserSavingsStats();

  usePageAnalytic(ScreensEnum.Earn);

  useInterval(
    () => {
      dispatch(loadAllFarmsAndStakesAction(tezosAddress));
      dispatch(loadAllSavingsAndStakesAction(tezosAddress));
    },
    APR_REFRESH_INTERVAL,
    [tezosAddress]
  );

  return (
    <>
      <Divider size={formatSize(8)} />
      <OpportunityCategoryCard
        title="Savings"
        description="Earn passive income and diversify your assets on Tezos."
        screen={ScreensEnum.Savings}
        depositAmountInFiat={savingsTotalStakedAmountInFiat}
        iconName={IconNameEnum.Database}
        netApr={savingsNetApr}
        maxApr={savingsMaxApr}
        testID={EarnPageSelectors.SavingsCard}
      />
      <OpportunityCategoryCard
        title="Farming"
        description="Earn extra rewards by participating in farm."
        screen={ScreensEnum.Farming}
        depositAmountInFiat={farmsTotalStakedAmountInFiat}
        iconName={IconNameEnum.Data}
        netApr={farmsNetApr}
        maxApr={farmsMaxApr}
        testID={EarnPageSelectors.FarmingCard}
      />
    </>
  );
};
