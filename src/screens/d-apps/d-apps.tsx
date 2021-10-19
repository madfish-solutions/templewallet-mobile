import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from '../../components/divider/divider';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { SearchInput } from '../../components/search-input/search-input';
import { loadDAppsListActions } from '../../store/d-apps/d-apps-actions';
import { useDAppsListSelector } from '../../store/d-apps/d-apps-selectors';
import { useThemeSelector } from '../../store/settings/settings-selectors';
import { formatSize } from '../../styles/format-size';
import { useDAppsStyles } from './d-apps.styles';
import { IntegratedDApp } from './integrated/integrated';
import { OthersDApp } from './others/others';

export const DApps = () => {
  const dispatch = useDispatch();
  useEffect(() => void dispatch(loadDAppsListActions.submit()), []);

  const theme = useThemeSelector();
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
      <View style={styles.container}>
        <Text style={styles.title}>Integrated</Text>
        <Divider size={formatSize(12)} />
        <IntegratedDApp
          iconName={theme === 'dark' ? IconNameEnum.QuipuSwapDark : IconNameEnum.QuipuSwap}
          title="QuipuSwap"
          description="The most efficient DApp for Tezos"
          url="https://quipuswap.com"
        />
      </View>
      <Divider size={formatSize(36)} />
      <View style={styles.marginLeft}>
        <Text style={styles.title}>Others</Text>
        <Divider size={formatSize(12)} />
        <View style={styles.list}>
          {sortedDAppsList.length ? (
            <FlatList
              data={sortedDAppsList}
              renderItem={item => <OthersDApp item={item} />}
              keyExtractor={item => item.name}
              numColumns={2}
            />
          ) : (
            <Text style={styles.title}>Not found</Text>
          )}
        </View>
      </View>
    </>
  );
};
