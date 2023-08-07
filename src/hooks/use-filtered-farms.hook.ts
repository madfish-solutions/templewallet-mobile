import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { SingleFarmResponse } from 'src/apis/quipuswap-staking/types';
import { FarmsSortFieldEnum } from 'src/enums/farms-sort-fields.enum';
import { selectSortValueAction } from 'src/store/farms/actions';
import { useAllFarmsSelector, useFarmSortFieldSelector, useLastStakesSelector } from 'src/store/farms/selectors';
import { sortByApy, sortByNewest, sortByOldest } from 'src/utils/earn.utils';
import { isAssetSearched } from 'src/utils/token-metadata.utils';

import { isString } from '../utils/is-string';

export const useFilteredFarms = () => {
  const dispatch = useDispatch();
  const stakes = useLastStakesSelector();
  const { data: farms, isLoading } = useAllFarmsSelector();
  const sortField = useFarmSortFieldSelector();

  const [searchValue, setSearchValue] = useState<string>();
  const [depositedOnly, setDepositedOnly] = useState<boolean>(false);

  const filteredFarmsList = useMemo<Array<SingleFarmResponse>>(() => {
    let result: Array<SingleFarmResponse> = [...farms];

    if (depositedOnly) {
      const stakedFarmsAddresses = Object.keys(stakes);
      result = result.filter(farm => stakedFarmsAddresses.includes(farm.item.contractAddress));
    }

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();

      result = result.filter(farm => {
        const isRewardsTokenSearched = isAssetSearched(
          {
            name: farm.item.rewardToken.metadata.name,
            symbol: farm.item.rewardToken.metadata.symbol,
            address: farm.item.rewardToken.contractAddress
          },
          lowerCaseSearchValue
        );
        const isStakedTokenSearched = farm.item.tokens.find(token =>
          isAssetSearched(
            { name: token.metadata.name, symbol: token.metadata.symbol, address: token.contractAddress },
            lowerCaseSearchValue
          )
        );

        return isRewardsTokenSearched || isStakedTokenSearched;
      });
    }

    switch (sortField) {
      case FarmsSortFieldEnum.APY:
        result.sort(sortByApy);
        break;
      case FarmsSortFieldEnum.Newest:
        result.sort(sortByNewest);
        break;
      case FarmsSortFieldEnum.Oldest:
        result.sort(sortByOldest);
        break;
    }

    return result;
  }, [farms, searchValue, depositedOnly, sortField, stakes]);

  const handleSetSortField = useCallback(
    (sortField: FarmsSortFieldEnum) => dispatch(selectSortValueAction(sortField)),
    [dispatch]
  );
  const handleToggleDepositOnly = useCallback(() => setDepositedOnly(prevState => !prevState), []);

  return {
    sortField,
    depositedOnly,
    filteredFarmsList,
    isFarmsLoading: isLoading,
    setSearchValue,
    handleSetSortField,
    handleToggleDepositOnly
  };
};
