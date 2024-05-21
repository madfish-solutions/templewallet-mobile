import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { EarnOpportunity } from 'src/types/earn-opportunity.types';
import { sortByApr, sortByNewest, sortByOldest } from 'src/utils/earn.utils';
import { isAssetSearched } from 'src/utils/token-metadata.utils';

import { isString } from '../utils/is-string';

export const useFilteredEarnOpportunities = <T extends EarnOpportunity, E extends string>(
  selectSortValueAction: ActionCreatorWithPayload<EarnOpportunitiesSortFieldEnum, E>,
  sortField: EarnOpportunitiesSortFieldEnum,
  items: T[],
  stakes: Record<string, UserStakeValueInterface | undefined>
) => {
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState<string>();
  const [depositedOnly, setDepositedOnly] = useState<boolean>(false);

  const filteredItemsList = useMemo(() => {
    let result = [...items];

    if (depositedOnly) {
      result = result.filter(item => {
        const stake = stakes[item.contractAddress];

        return stake && Number(stake.depositAmountAtomic ?? '0') > 0;
      });
    }

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();

      result = result.filter(item => {
        const isRewardsTokenSearched = isAssetSearched(
          {
            name: item.rewardToken.metadata.name,
            symbol: item.rewardToken.metadata.symbol,
            address: item.rewardToken.contractAddress
          },
          lowerCaseSearchValue
        );
        const isStakedTokenSearched = item.tokens.find(token =>
          isAssetSearched(
            { name: token.metadata.name, symbol: token.metadata.symbol, address: token.contractAddress },
            lowerCaseSearchValue
          )
        );

        return isRewardsTokenSearched || isStakedTokenSearched;
      });
    }

    switch (sortField) {
      case EarnOpportunitiesSortFieldEnum.APR:
        result.sort(sortByApr);
        break;
      case EarnOpportunitiesSortFieldEnum.Newest:
        result.sort(sortByNewest);
        break;
      case EarnOpportunitiesSortFieldEnum.Oldest:
        result.sort(sortByOldest);
        break;
    }

    return result;
  }, [items, depositedOnly, searchValue, sortField, stakes]);

  const handleSetSortField = useCallback(
    (sortField: EarnOpportunitiesSortFieldEnum) => dispatch(selectSortValueAction(sortField)),
    [dispatch, selectSortValueAction]
  );
  const handleToggleDepositOnly = useCallback(() => setDepositedOnly(prevState => !prevState), []);

  return {
    depositedOnly,
    filteredItemsList,
    setSearchValue,
    handleSetSortField,
    handleToggleDepositOnly
  };
};
