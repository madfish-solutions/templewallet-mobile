import React from 'react';

import { HeaderCard } from '../../components/header-card/header-card';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { Table } from './table/table';
import { TezosInfo } from './tezos-info/tezos-info';

export const Market = () => {
  usePageAnalytic(ScreensEnum.Market);

  return (
    <>
      <HeaderCard hasInsetTop={true}>
        <TezosInfo />
      </HeaderCard>
      <Table />
    </>
  );
};
