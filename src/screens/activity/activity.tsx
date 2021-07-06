import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityGroupsList } from '../../components/activity-groups-list/activity-groups-list';
import { SearchInput } from '../../components/search-input/search-input';
import { useFilteredActivityGroups } from '../../hooks/use-filtered-activity-groups.hook';
import { loadActivityGroupsActions } from '../../store/activity/activity-actions';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { accountPkh$ } from '../../utils/activity.utils';

export const Activity = () => {
  const dispatch = useDispatch();
  const selectedAccount = useSelectedAccountSelector();
  const { filteredActivityGroups, setSearchValue } = useFilteredActivityGroups();

  useEffect(() => {
    dispatch(loadActivityGroupsActions.submit(selectedAccount.publicKeyHash));
    accountPkh$.next(selectedAccount.publicKeyHash);
  }, []);

  return (
    <>
      <SearchInput placeholder="Search" onChangeText={setSearchValue} />
      <ActivityGroupsList activityGroups={filteredActivityGroups} />
    </>
  );
};
