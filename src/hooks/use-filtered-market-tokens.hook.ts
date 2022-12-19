import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { MarketTokensSortFieldEnum } from '../enums/market-tokens-sort-field.enum';
import { selectSortValue } from '../store/market/market-actions';
import {
  useFavouriteTokensIds,
  useMarketTopCoinsWithoutTez,
  useSortFieldSelector
} from '../store/market/market-selectors';
import { isString } from '../utils/is-string';
import { sortMarketTokens } from '../utils/market.util';
import { MarketToken } from './../store/market/market.interfaces';

export const useFilterdMarketTokens = () => {
  const dispatch = useDispatch();
  const tokens = useMarketTopCoinsWithoutTez();
  const sortFiled = useSortFieldSelector();
  const favouriteTokensIds = useFavouriteTokensIds();

  const segmentControlIndexDefault = favouriteTokensIds.length === 0 ? 0 : 1;

  const [searchValue, setSearchValue] = useState<string>();
  const [segmentControlIndex, setSegmentControlIndex] = useState<number>(segmentControlIndexDefault);

  const filteredTokensList = useMemo<Array<MarketToken>>(() => {
    const source = segmentControlIndex === 0 ? tokens : tokens.filter(item => favouriteTokensIds.includes(item.id));
    const sortedMarketCoins = sortMarketTokens(source, sortFiled);

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: Array<MarketToken> = [];

      for (const asset of sortedMarketCoins) {
        const { name, symbol } = asset;

        if (name.toLowerCase().includes(lowerCaseSearchValue) || symbol.toLowerCase().includes(lowerCaseSearchValue)) {
          result.push(asset);
        }
      }

      return result;
    } else {
      return sortedMarketCoins;
    }
  }, [searchValue, sortFiled, segmentControlIndex, favouriteTokensIds]);

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
