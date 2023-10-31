import React, { memo } from 'react';

import { HeaderCard } from 'src/components/header-card/header-card';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { TezosInfo } from './tezos-info/tezos-info';
import { TopTokensTable } from './top-coins-table/top-tokens-table';

export const Market = memo(() => {
  usePageAnalytic(ScreensEnum.Market);

  return (
    <>
      <HeaderCard hasInsetTop={true}>
        <TezosInfo />
      </HeaderCard>
      <TopTokensTable />
    </>
  );
});
