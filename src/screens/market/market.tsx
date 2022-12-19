import React from 'react';
import { useDispatch } from 'react-redux';

import { HeaderCard } from '../../components/header-card/header-card';
import { useBlockSubscription } from '../../hooks/block-subscription/use-block-subscription.hook';
import { useAuthorisedTimerEffect } from '../../hooks/use-timer-effect.hook';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { loadMarketTokensSlugsActions, loadMarketTopTokenActions } from '../../store/market/market-actions';
import { useSelectedRpcUrlSelector } from '../../store/settings/settings-selectors';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { TezosInfo } from './tezos-info/tezos-info';
import { TopTokensTable } from './top-coins-table/top-tokens-table';

const DATA_REFRESH_INTERVAL = 60 * 1000;

export const Market = () => {
  const dispatch = useDispatch();
  const blockSubscription = useBlockSubscription();
  const selectedAccount = useSelectedAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const initDataLoading = () => {
    dispatch(loadMarketTopTokenActions.submit());
    dispatch(loadMarketTokensSlugsActions.submit());
  };

  useAuthorisedTimerEffect(initDataLoading, DATA_REFRESH_INTERVAL, [
    blockSubscription.block.header,
    selectedAccount.publicKeyHash,
    selectedRpcUrl
  ]);

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
