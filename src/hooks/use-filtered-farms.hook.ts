import { BigNumber } from 'bignumber.js';
import { useMemo, useState } from 'react';

import { SingleFarmResponse } from 'src/apis/quipuswap-staking/types';
import { FarmsSortFieldEnum } from 'src/enums/farms-sort-fields.enum';
import { useAllFarmsSelector, useLastStakesSelector } from 'src/store/farms/selectors';
import { isAssetSearched } from 'src/utils/token-metadata.utils';

import { isString } from '../utils/is-string';

export const useFilteredFarms = () => {
  const stakes = useLastStakesSelector();
  const { data: farms, isLoading } = useAllFarmsSelector();

  const [searchValue, setSearchValue] = useState<string>();
  const [sortField, setSortField] = useState<FarmsSortFieldEnum>(FarmsSortFieldEnum.Default);
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
          { name: farm.item.rewardToken.metadata.name, symbol: farm.item.rewardToken.metadata.symbol },
          lowerCaseSearchValue
        );
        const isStakedTokenSearched = farm.item.tokens.find(token =>
          isAssetSearched({ name: token.metadata.name, symbol: token.metadata.symbol }, lowerCaseSearchValue)
        );

        return isRewardsTokenSearched || isStakedTokenSearched;
      });
    }

    switch (sortField) {
      case FarmsSortFieldEnum.APY:
        result.sort((farmA, farmB) => new BigNumber(farmB?.item?.apr ?? 0).minus(farmA?.item?.apr ?? 0).toNumber());
        break;
      case FarmsSortFieldEnum.Newest:
        result.reverse();
        break;
    }

    return result;
  }, [farms, searchValue, depositedOnly, sortField]);

  const handleSetSortField = (sortField: FarmsSortFieldEnum) => setSortField(sortField);
  const handleToggleDepositOnly = () => setDepositedOnly(prevState => !prevState);

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
