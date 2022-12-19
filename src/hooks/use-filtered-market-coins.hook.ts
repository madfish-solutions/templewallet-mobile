import { useMemo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { MarketCoinsSortFieldEnum } from '../enums/market-coins-sort-field.enum';
import { selectSortValue } from '../store/market/market-actions';
import {
  useFavouriteTokensIds,
  useMarketTopCoinsWithoutTez,
  useSortFieldSelector
} from '../store/market/market-selectors';
import { isString } from '../utils/is-string';
import { sortMarketCoins } from '../utils/market.util';
import { MarketCoin } from './../store/market/market.interfaces';

export const useFilterdMarketCoins = () => {
  const dispatch = useDispatch();
  const tokens = useMarketTopCoinsWithoutTez();
  const sortFiled = useSortFieldSelector();
  const favouriteTokensIds = useFavouriteTokensIds();

  const inputTypeIndexDefault = favouriteTokensIds.length === 0 ? 0 : 1;

  const [searchValue, setSearchValue] = useState<string>();
  const [inputTypeIndex, setInputTypeIndex] = useState<number>(inputTypeIndexDefault);

  const filteredAssetsList = useMemo<Array<MarketCoin>>(() => {
    const source = inputTypeIndex === 0 ? tokens : tokens.filter(item => favouriteTokensIds.includes(item.id));
    const sortedMarketCoins = sortMarketCoins(source, sortFiled);

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: Array<MarketCoin> = [];

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
  }, [searchValue, sortFiled, inputTypeIndex, favouriteTokensIds]);

  const handleSetSortField = useCallback(
    (sortValue: string) => dispatch(selectSortValue(sortValue as MarketCoinsSortFieldEnum)),
    []
  );

  const handleSelectorChange = (index: number) => setInputTypeIndex(index);

  return {
    sortFiled,
    filteredAssetsList,
    inputTypeIndex,
    setSearchValue,
    handleSetSortField,
    handleSelectorChange
  };
};
