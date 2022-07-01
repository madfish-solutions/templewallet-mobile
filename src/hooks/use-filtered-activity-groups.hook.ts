import { useEffect, useState } from 'react';

import { ActivityGroup } from '../interfaces/activity.interface';
import { getTokenSlug } from '../token/utils/token.utils';
import { isString } from '../utils/is-string';
import { useGeneralActivity } from './use-general-activity';
import { useTokenMetadataGetter } from './use-token-metadata-getter.hook';

export const useFilteredActivityGroups = () => {
  const { activities } = useGeneralActivity();

  const getTokenMetadata = useTokenMetadataGetter();

  const [searchValue, setSearchValue] = useState<string>();
  const [filteredActivityGroups, setFilteredActivityGroupsList] = useState<ActivityGroup[]>([]);

  useEffect(() => {
    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: ActivityGroup[] = [];

      for (const activityGroup of activities) {
        for (const activity of activityGroup) {
          const { source, destination } = activity;
          const { symbol, name, address, id } = getTokenMetadata(getTokenSlug(activity));

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

          if (`${address.toLowerCase()}_${id}` === lowerCaseSearchValue) {
            result.push(activityGroup);
            break;
          }
        }
      }

      setFilteredActivityGroupsList(result);
    } else {
      setFilteredActivityGroupsList(activities);
    }
  }, [searchValue, activities, getTokenMetadata]);

  return {
    filteredActivityGroups,
    setSearchValue
  };
};
