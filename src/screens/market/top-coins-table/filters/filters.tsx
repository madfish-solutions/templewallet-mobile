import React, { FC } from 'react';
import { View } from 'react-native';

import { Search } from '../../../../components/search/search';
import { TextSegmentControl } from '../../../../components/segmented-control/text-segment-control/text-segment-control';
import { Sorter } from '../../../../components/sorter/sorter';
import { EventFn } from '../../../../config/general';
import { MarketTokensSortFieldEnum } from '../../../../enums/market-tokens-sort-field.enum';
import { formatSize } from '../../../../styles/format-size';
import { useFilterStyles } from './filter.styles';

const marketTokensSortFieldsLabels: Record<MarketTokensSortFieldEnum, string> = {
  [MarketTokensSortFieldEnum.Volume]: 'Volume',
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
  onSetSortValue: EventFn<MarketTokensSortFieldEnum>;
  onSelectorChange: EventFn<number>;
  onSearchValueChange: EventFn<string | undefined>;
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
        width={formatSize(168)}
        values={['Market', 'Favourites']}
        onChange={onSelectorChange}
      />
      <Search onChange={onSearchValueChange}>
        <Sorter
          sortValue={sortFiled}
          description="Sort tokens by:"
          sortFieldsOptions={marketTokensSortFieldsOptions}
          sortFieldsLabels={marketTokensSortFieldsLabels}
          onSetSortValue={onSetSortValue}
        />
      </Search>
    </View>
  );
};
