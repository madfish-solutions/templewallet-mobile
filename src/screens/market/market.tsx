import React from 'react';

import { HeaderCard } from '../../components/header-card/header-card';
import { Table } from './table/table';
import { TezosInfo } from './tezos-info/tezos-info';

export const Market = () => (
  <>
    <HeaderCard hasInsetTop={true}>
      <TezosInfo />
    </HeaderCard>
    <Table />
  </>
);
