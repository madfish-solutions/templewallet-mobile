import React from 'react';
import { useDispatch } from 'react-redux';

import { loadPartnersPromoActions } from 'src/store/partners-promotion/partners-promotion-actions';
import { OptimalPromotionAdType } from 'src/utils/optimal.utils';

import { HeaderCard } from '../../components/header-card/header-card';
import { useAuthorisedTimerEffect } from '../../hooks/use-timer-effect.hook';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { loadMarketTokensSlugsActions, loadMarketTopTokenActions } from '../../store/market/market-actions';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { TezosInfo } from './tezos-info/tezos-info';
import { TopTokensTable } from './top-coins-table/top-tokens-table';

const DATA_REFRESH_INTERVAL = 60 * 1000;

export const Market = () => {
  const dispatch = useDispatch();

  const initDataLoading = () => {
    dispatch(loadMarketTopTokenActions.submit());
    dispatch(loadMarketTokensSlugsActions.submit());
    dispatch(loadPartnersPromoActions.submit(OptimalPromotionAdType.TwMobile));
  };

  useAuthorisedTimerEffect(initDataLoading, DATA_REFRESH_INTERVAL);

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
