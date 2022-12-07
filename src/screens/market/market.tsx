import React from 'react';
import { View } from 'react-native';

import { HeaderCard } from '../../components/header-card/header-card';
import { Table } from './table/table';
import { TezosInfo } from './tezos-info/tezos-info';

export const Market = () => (
  <View>
    <HeaderCard hasInsetTop={true}>
      <TezosInfo />
    </HeaderCard>
    <Table />
  </View>
);
