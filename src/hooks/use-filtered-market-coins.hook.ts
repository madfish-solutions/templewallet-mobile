import { useMemo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { MarketCoinsSortFieldEnum } from '../enums/market-coins-sort-field.enum';
import { selectSortValue } from '../store/market/market-actions';
import {
  useFavouriteTokens,
  useMarketTopCoinsWithoutTez,
  useSortFieldSelector
} from '../store/market/market-selectors';
import { isString } from '../utils/is-string';
import { MarketCoin } from './../store/market/market.interfaces';

const sortMarketCoins = (marketCoins: Array<MarketCoin>, sortField: MarketCoinsSortFieldEnum) => {
  switch (sortField) {
    case MarketCoinsSortFieldEnum.Price:
      return marketCoins.sort((a, b) => {
        if (a.price !== null && b.price !== null) {
          return b.price - a.price;
        }

        return 0;
      });

    case MarketCoinsSortFieldEnum.Volume:
      return marketCoins.sort((a, b) => {
        if (a.volume24h !== null && b.volume24h !== null) {
          return b.volume24h - a.volume24h;
        }

        return 0;
      });

    case MarketCoinsSortFieldEnum.PriceChange:
      return marketCoins.sort((a, b) => {
        if (a.priceChange24h !== null && b.priceChange24h !== null) {
          return b.priceChange24h - a.priceChange24h;
        }

        return 0;
      });

    default:
      return marketCoins;
  }
};

export const useFilterdMarketCoins = () => {
  const dispatch = useDispatch();
  const tokens = useMarketTopCoinsWithoutTez();
  const sortFiled = useSortFieldSelector();
  const favouriteTokens = useFavouriteTokens();

  const [searchValue, setSearchValue] = useState<string>();
  const [inputTypeIndex, setInputTypeIndex] = useState<number>(0);

  const filteredAssetsList = useMemo<Array<MarketCoin>>(() => {
    const source =
      inputTypeIndex === 0 ? tokens : tokens.filter(item => favouriteTokens.includes(`${item.id}-${item.symbol}`));
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
  }, [searchValue, sortFiled, inputTypeIndex, favouriteTokens]);

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
