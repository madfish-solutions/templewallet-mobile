import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, RefreshControl, ListRenderItem } from 'react-native';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { Search } from '../../../components/search/search';
import { TextSegmentControl } from '../../../components/segmented-control/text-segment-control/text-segment-control';
import { Sorter } from '../../../components/sorter/sorter';
import { MarketCoinsSortFieldEnum } from '../../../enums/market-coins-sort-field.enum';
import { useFakeRefreshControlProps } from '../../../hooks/use-fake-refresh-control-props.hook';
import { useFilterdMarketCoins } from '../../../hooks/use-filtered-market-coins.hook';
import { MarketCoin } from '../../../store/market/market.interfaces';
import { formatSize } from '../../../styles/format-size';
import { Row } from './row/row';
import { useTableStyles } from './table.styles';

const marketCoinsSortFieldsLabels: Record<MarketCoinsSortFieldEnum, string> = {
  [MarketCoinsSortFieldEnum.Volume]: 'Volume',
  [MarketCoinsSortFieldEnum.Price]: 'Price',
  [MarketCoinsSortFieldEnum.PriceChange]: 'Price Change'
};

const marketCoinsSortFieldsOptions: Array<MarketCoinsSortFieldEnum> = [
  MarketCoinsSortFieldEnum.Volume,
  MarketCoinsSortFieldEnum.Price,
  MarketCoinsSortFieldEnum.PriceChange
];

export const Table = () => {
  const [inputTypeIndex, setInputTypeIndex] = useState(0);

  const styles = useTableStyles();
  const { filteredAssetsList, sortFiled, setSearchValue, handleSetSortField } = useFilterdMarketCoins();

  const fakeRefreshControlProps = useFakeRefreshControlProps();
  const onChange = (index: number) => setInputTypeIndex(index);

  const renderFlatListItem: ListRenderItem<MarketCoin> = useCallback(({ item }) => <Row item={item} />, []);

  return (
    <View style={styles.rootContainer}>
      <View style={styles.filtersContainer}>
        <TextSegmentControl
          selectedIndex={inputTypeIndex}
          width={formatSize(168)}
          values={['Market', 'Favourites']}
          onChange={onChange}
        />
        <Search onChange={setSearchValue}>
          <Sorter
            sortValue={sortFiled}
            description="Sort tokens by:"
            sortFieldsLabels={marketCoinsSortFieldsLabels}
            sortFieldsOptions={marketCoinsSortFieldsOptions}
            handleSetSortValue={handleSetSortField}
          />
        </Search>
      </View>
      <View style={styles.columns}>
        <Text style={[styles.text, styles.name]}>NAME</Text>
        <Text style={[styles.text, styles.price]}>PRICE</Text>
        <Text style={[styles.text, styles.h24]}>24H</Text>
        <Text style={styles.text}>VOLUME (24H)</Text>
      </View>
      <FlatList
        scrollEnabled
        data={filteredAssetsList}
        renderItem={renderFlatListItem}
        ListEmptyComponent={<DataPlaceholder text="No records found." />}
        refreshControl={<RefreshControl {...fakeRefreshControlProps} />}
      />
    </View>
  );
};
