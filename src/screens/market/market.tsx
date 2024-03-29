import React from 'react';
import { useDispatch } from 'react-redux';

import { HeaderCard } from 'src/components/header-card/header-card';
import { MARKET_SYNC_INTERVAL } from 'src/config/fixed-times';
import { useAuthorisedInterval } from 'src/hooks/use-authed-interval';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadMarketTokensSlugsActions } from 'src/store/market/market-actions';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { TezosInfo } from './tezos-info/tezos-info';
import { TopTokensTable } from './top-coins-table/top-tokens-table';

export const Market = () => {
  const dispatch = useDispatch();

  useAuthorisedInterval(() => dispatch(loadMarketTokensSlugsActions.submit()), MARKET_SYNC_INTERVAL);

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
