import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { isAssetSearched } from 'src/utils/token-metadata.utils';

import { MarketTokensSortFieldEnum } from '../enums/market-tokens-sort-field.enum';
import { selectSortValue } from '../store/market/market-actions';
import {
  useFavouriteTokensIdsSelector,
  useMarketTopTokensWithoutTezSelector,
  useSortFieldSelector
} from '../store/market/market-selectors';
import { MarketToken } from '../store/market/market.interfaces';
import { isString } from '../utils/is-string';
import { sortMarketTokens } from '../utils/market.utils';

export const useFilteredMarketTokens = () => {
  const dispatch = useDispatch();
  const tokens = useMarketTopTokensWithoutTezSelector();
  const sortFiled = useSortFieldSelector();
  const favouriteTokensIds = useFavouriteTokensIdsSelector();

  const segmentControlIndexDefault = favouriteTokensIds.length === 0 ? 0 : 1;

  const [searchValue, setSearchValue] = useState<string>();
  const [segmentControlIndex, setSegmentControlIndex] = useState<number>(segmentControlIndexDefault);

  const filteredTokensList = useMemo<Array<MarketToken>>(() => {
    const source = segmentControlIndex === 0 ? tokens : tokens.filter(item => favouriteTokensIds.includes(item.id));
    const sortedMarketTokens = sortMarketTokens(source, sortFiled);

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: Array<MarketToken> = [];

      for (const asset of sortedMarketTokens) {
        const { name, symbol } = asset;

        if (isAssetSearched({ name, symbol }, lowerCaseSearchValue)) {
          result.push(asset);
        }
      }

      return result;
    } else {
      return sortedMarketTokens;
    }
  }, [searchValue, sortFiled, segmentControlIndex, favouriteTokensIds, tokens]);

  const handleSetSortField = (sortValue: MarketTokensSortFieldEnum) => dispatch(selectSortValue(sortValue));
  const handleSelectorChange = (index: number) => setSegmentControlIndex(index);

  return {
    sortFiled,
    filteredTokensList,
    segmentControlIndex,
    setSearchValue,
    handleSetSortField,
    handleSelectorChange
  };
};
