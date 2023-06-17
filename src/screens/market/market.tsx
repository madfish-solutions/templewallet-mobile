import React from 'react';
import { useDispatch } from 'react-redux';

import { HeaderCard } from 'src/components/header-card/header-card';
import { MARKET_SYNC_INTERVAL, PROMO_SYNC_INTERVAL } from 'src/config/fixed-times';
import { useAuthorisedInterval } from 'src/hooks/use-interval.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadMarketTokensSlugsActions, loadMarketTopTokenActions } from 'src/store/market/market-actions';
import { loadPartnersPromoActions } from 'src/store/partners-promotion/partners-promotion-actions';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { OptimalPromotionAdType } from 'src/utils/optimal.utils';

import { useIsPartnersPromoEnabledSelector } from '../../store/partners-promotion/partners-promotion-selectors';
import { TezosInfo } from './tezos-info/tezos-info';
import { TopTokensTable } from './top-coins-table/top-tokens-table';

export const Market = () => {
  const dispatch = useDispatch();
  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();

  useAuthorisedInterval(() => {
    dispatch(loadMarketTopTokenActions.submit());
    dispatch(loadMarketTokensSlugsActions.submit());
  }, MARKET_SYNC_INTERVAL);

  useAuthorisedInterval(() => {
    if (partnersPromotionEnabled) {
      dispatch(loadPartnersPromoActions.submit(OptimalPromotionAdType.TwMobile));
    }
  }, PROMO_SYNC_INTERVAL);

  usePageAnalytic(ScreensEnum.Market);

  return (
    <>
      <HeaderCard hasInsetTop={true}>
        <TezosInfo />
      </HeaderCard>
      <TopTokensTable />
    </>
  );
};
