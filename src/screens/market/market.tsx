import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, RefreshControl, View } from 'react-native';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { useFakeRefreshControlProps } from '../../hooks/use-fake-refresh-control-props.hook';
import { useMarketTopCoinsWithoutTez } from '../../store/market/market-selectors';
import { MarketCoin } from '../../store/market/market.interfaces';
import { Row } from './row/row';

export const Market = () => {
  const marketTopCoinsWithoutTez = useMarketTopCoinsWithoutTez();
  const fakeRefreshControlProps = useFakeRefreshControlProps();

  const renderFlatListItem: ListRenderItem<MarketCoin> = useCallback(({ item }) => <Row item={item} />, []);

  return (
    <View style={{ marginTop: 42 }}>
      <FlatList
        scrollEnabled
        data={marketTopCoinsWithoutTez}
        renderItem={renderFlatListItem}
        ListEmptyComponent={<DataPlaceholder text="No records found." />}
        refreshControl={<RefreshControl {...fakeRefreshControlProps} />}
      />
    </View>
  );
};
