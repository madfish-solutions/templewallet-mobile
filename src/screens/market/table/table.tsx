import React, { useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, ListRenderItem } from 'react-native';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { useFakeRefreshControlProps } from '../../../hooks/use-fake-refresh-control-props.hook';
import { useMarketTopCoinsWithoutTez } from '../../../store/market/market-selectors';
import { MarketCoin } from '../../../store/market/market.interfaces';
import { Row } from './row/row';
import { useTableStyles } from './table.styles';

export const Table = () => {
  const styles = useTableStyles();
  const marketTopCoinsWithoutTez = useMarketTopCoinsWithoutTez();

  const fakeRefreshControlProps = useFakeRefreshControlProps();

  const renderFlatListItem: ListRenderItem<MarketCoin> = useCallback(({ item }) => <Row item={item} />, []);

  return (
    <View>
      <View style={styles.columns}>
        <Text style={[styles.text, styles.name]}>NAME</Text>
        <Text style={[styles.text, styles.price]}>PRICE</Text>
        <Text style={[styles.text, styles.h24]}>24H</Text>
        <Text style={styles.text}>VOLUME (24H)</Text>
      </View>
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
