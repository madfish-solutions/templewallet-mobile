import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, RefreshControl, ListRenderItem } from 'react-native';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { Search } from '../../../components/search/search';
import { TextSegmentControl } from '../../../components/segmented-control/text-segment-control/text-segment-control';
import { Sorter } from '../../../components/sorter/sorter';
import { useFakeRefreshControlProps } from '../../../hooks/use-fake-refresh-control-props.hook';
import { useMarketTopCoinsWithoutTez } from '../../../store/market/market-selectors';
import { MarketCoin } from '../../../store/market/market.interfaces';
import { formatSize } from '../../../styles/format-size';
import { Row } from './row/row';
import { useTableStyles } from './table.styles';

enum MarketCoinsSortFieldEnum {
  Volume = 'volume',
  Price = 'price',
  Supply = 'supply'
}

const marketCoinsSortFieldsLabels: Record<MarketCoinsSortFieldEnum, string> = {
  [MarketCoinsSortFieldEnum.Volume]: 'Volume',
  [MarketCoinsSortFieldEnum.Price]: 'Price',
  [MarketCoinsSortFieldEnum.Supply]: 'Supply'
};

const marketCoinsSortFieldsOptions: Array<MarketCoinsSortFieldEnum> = [
  MarketCoinsSortFieldEnum.Volume,
  MarketCoinsSortFieldEnum.Price,
  MarketCoinsSortFieldEnum.Supply
];

export const Table = () => {
  const [inputTypeIndex, setInputTypeIndex] = useState(0);
  const [, setSearchValue] = useState<string>();
  const [sortValue, setSortValue] = useState<string>(MarketCoinsSortFieldEnum.Volume);

  const styles = useTableStyles();
  const marketTopCoinsWithoutTez = useMarketTopCoinsWithoutTez();

  const fakeRefreshControlProps = useFakeRefreshControlProps();
  const onChange = (index: number) => setInputTypeIndex(index);
  const handleSetSortValue = (value: string) => setSortValue(value);

  const renderFlatListItem: ListRenderItem<MarketCoin> = useCallback(({ item }) => <Row item={item} />, []);

  return (
    <View style={{ flexGrow: 1, flexShrink: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: formatSize(16),
          paddingVertical: formatSize(12)
        }}
      >
        <TextSegmentControl
          selectedIndex={inputTypeIndex}
          width={formatSize(158)}
          values={['Market', 'Favourite']}
          onChange={onChange}
        />
        <Search onChange={setSearchValue}>
          <Sorter
            sortValue={sortValue}
            description="Sort tokens by:"
            sortFieldsLabels={marketCoinsSortFieldsLabels}
            sortFieldsOptions={marketCoinsSortFieldsOptions}
            handleSetSortValue={handleSetSortValue}
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
        data={marketTopCoinsWithoutTez}
        renderItem={renderFlatListItem}
        ListEmptyComponent={<DataPlaceholder text="No records found." />}
        refreshControl={<RefreshControl {...fakeRefreshControlProps} />}
      />
    </View>
  );
};
