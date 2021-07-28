import { useEffect, useState } from 'react';

import { ActivityGroup } from '../interfaces/activity.interface';
import { useActivityGroupsSelector } from '../store/wallet/wallet-selectors';
import { getTokenSlug } from '../token/utils/token.utils';
import { isString } from '../utils/is-string';
import { useTokenMetadata } from './use-token-metadata.hook';

export const useFilteredActivityGroups = () => {
  const activityGroups = useActivityGroupsSelector();
  const { getTokenMetadata } = useTokenMetadata();

  const [searchValue, setSearchValue] = useState<string>();
  const [filteredActivityGroups, setFilteredActivityGroupsList] = useState<ActivityGroup[]>([]);

  useEffect(() => {
    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: ActivityGroup[] = [];

      for (const activityGroup of activityGroups) {
        for (const activity of activityGroup) {
          const { source, destination } = activity;
          const { symbol, name, address } = getTokenMetadata(getTokenSlug(activity));

          if (
            symbol.toLowerCase().includes(lowerCaseSearchValue) ||
            name.toLowerCase().includes(lowerCaseSearchValue) ||
            address.toLowerCase().includes(lowerCaseSearchValue) ||
            source.address.toLowerCase().includes(lowerCaseSearchValue) ||
            destination.address.toLowerCase().includes(lowerCaseSearchValue)
          ) {
            result.push(activityGroup);
            break;
          }
        }
      }

      setFilteredActivityGroupsList(result);
    } else {
      setFilteredActivityGroupsList(activityGroups);
    }
  }, [searchValue, activityGroups, getTokenMetadata]);

  return {
    filteredActivityGroups,
    setSearchValue
  };
};
