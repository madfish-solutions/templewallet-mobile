import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityGroupsList } from '../../components/activity-groups-list/activity-groups-list';
import { SearchInput } from '../../components/search-input/search-input';
import { useFilteredActivityGroups } from '../../hooks/use-filtered-activity-groups.hook';
import { loadActivityGroupsActions } from '../../store/wallet/wallet-actions';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { useActivityStyles } from './activity.styles';

export const Activity = () => {
  const styles = useActivityStyles();
  const dispatch = useDispatch();
  const selectedAccount = useSelectedAccountSelector();
  const { filteredActivityGroups, setSearchValue } = useFilteredActivityGroups();

  useEffect(() => void dispatch(loadActivityGroupsActions.submit(selectedAccount.publicKeyHash)), []);

  return (
    <>
      <SearchInput containerStyle={styles.inputContainer} placeholder="Search" onChangeText={setSearchValue} />
      <ActivityGroupsList activityGroups={filteredActivityGroups} />
    </>
  );
};
