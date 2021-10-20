import React, { useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { Divider } from '../../components/divider/divider';
import { SearchInput } from '../../components/search-input/search-input';
import { loadDAppsListActions } from '../../store/d-apps/d-apps-actions';
import { useDAppsListSelector } from '../../store/d-apps/d-apps-selectors';
import { formatSize } from '../../styles/format-size';
import { useDAppsStyles } from './d-apps.styles';
import { OthersDApp } from './others/others';

export const DApps = () => {
  const dispatch = useDispatch();
  useEffect(() => void dispatch(loadDAppsListActions.submit()), []);

  const styles = useDAppsStyles();

  const DAppsList = useDAppsListSelector();

  const [searchQuery, setSearchQuery] = useState<string>();

  const sortedDAppsList = useMemo(() => {
    if (searchQuery) {
      return DAppsList.filter(dapp => dapp.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return DAppsList;
  }, [searchQuery, DAppsList]);

  return (
    <>
      <SearchInput placeholder="Search token" onChangeText={setSearchQuery} />
      <Divider size={formatSize(28)} />
      {sortedDAppsList.length ? (
        <FlatList
          data={sortedDAppsList}
          renderItem={item => <OthersDApp item={item} />}
          keyExtractor={item => item.name}
          numColumns={2}
          contentContainerStyle={styles.container}
        />
      ) : (
        <DataPlaceholder text="No records found." />
      )}
    </>
  );
};
