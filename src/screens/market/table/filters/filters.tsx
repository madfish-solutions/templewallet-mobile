import React, { FC } from 'react';
import { View } from 'react-native';

import { Search } from '../../../../components/search/search';
import { TextSegmentControl } from '../../../../components/segmented-control/text-segment-control/text-segment-control';
import { Sorter } from '../../../../components/sorter/sorter';
import { MarketCoinsSortFieldEnum } from '../../../../enums/market-coins-sort-field.enum';
import { formatSize } from '../../../../styles/format-size';
import { useFilterStyles } from './filter.styles';

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

interface Props {
  inputTypeIndex: number;
  sortFiled: MarketCoinsSortFieldEnum;
  onSetSortValue: (value: string) => void;
  onSelectorChange: (index: number) => void;
  onSearchValueChange: (value: string | undefined) => void;
}

export const Filters: FC<Props> = ({
  inputTypeIndex,
  sortFiled,
  onSetSortValue,
  onSelectorChange,
  onSearchValueChange
}) => {
  const styles = useFilterStyles();

  return (
    <View style={styles.filtersContainer}>
      <TextSegmentControl
        selectedIndex={inputTypeIndex}
        width={formatSize(168)}
        values={['Market', 'Favourites']}
        onChange={onSelectorChange}
      />
      <Search onChange={onSearchValueChange}>
        <Sorter
          sortValue={sortFiled}
          description="Sort tokens by:"
          sortFieldsLabels={marketCoinsSortFieldsLabels}
          sortFieldsOptions={marketCoinsSortFieldsOptions}
          onSetSortValue={onSetSortValue}
        />
      </Search>
    </View>
  );
};
