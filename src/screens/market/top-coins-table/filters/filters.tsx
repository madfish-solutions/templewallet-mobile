import React, { FC } from 'react';
import { View } from 'react-native';

import { Search } from 'src/components/search/search';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { Sorter } from 'src/components/sorter/sorter';
import { MarketTokensSortFieldEnum } from 'src/enums/market-tokens-sort-field.enum';
import { formatSize } from 'src/styles/format-size';

import { MarketSelectors } from '../../market.selectors';

import { useFilterStyles } from './filter.styles';

const marketTokensSortFieldsLabels: Record<MarketTokensSortFieldEnum, string> = {
  [MarketTokensSortFieldEnum.Volume]: 'Volume (24H)',
  [MarketTokensSortFieldEnum.Price]: 'Price',
  [MarketTokensSortFieldEnum.PriceChange]: '24H'
};

const marketTokensSortFieldsOptions: Array<MarketTokensSortFieldEnum> = [
  MarketTokensSortFieldEnum.Volume,
  MarketTokensSortFieldEnum.Price,
  MarketTokensSortFieldEnum.PriceChange
];

interface Props {
  segmentControlIndex: number;
  sortFiled: MarketTokensSortFieldEnum;
  onSetSortValue: SyncFn<MarketTokensSortFieldEnum>;
  onSelectorChange: SyncFn<number>;
  onSearchValueChange: SyncFn<string | undefined>;
}

export const Filters: FC<Props> = ({
  segmentControlIndex,
  sortFiled,
  onSetSortValue,
  onSelectorChange,
  onSearchValueChange
}) => {
  const styles = useFilterStyles();

  return (
    <View style={styles.filtersContainer}>
      <TextSegmentControl
        selectedIndex={segmentControlIndex}
        width={formatSize(160)}
        values={['Market', 'Favorites']}
        onChange={onSelectorChange}
        testID={MarketSelectors.marketToggle}
      />
      <Search onChange={onSearchValueChange} dividerSize={12} testID={MarketSelectors.search}>
        <Sorter
          bottomSheetContentHeight={224}
          sortValue={sortFiled}
          description="Sort tokens by:"
          sortFieldsOptions={marketTokensSortFieldsOptions}
          sortFieldsLabels={marketTokensSortFieldsLabels}
          onSetSortValue={onSetSortValue}
          testID={MarketSelectors.sorter}
        />
      </Search>
    </View>
  );
};
