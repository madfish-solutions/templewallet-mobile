import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { Disclaimer } from '../../components/disclaimer/disclaimer';
import { Divider } from '../../components/divider/divider';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { SearchInput } from '../../components/search-input/search-input';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { loadDAppsListActions } from '../../store/d-apps/d-apps-actions';
import { useDAppsListSelector } from '../../store/d-apps/d-apps-selectors';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { isDefined } from '../../utils/is-defined';
import { useDAppsStyles } from './d-apps.styles';
import { IntegratedDApp } from './integrated/integrated';
import { OthersDApp } from './others/others';

export const DApps = () => {
  const dispatch = useDispatch();
  useEffect(() => void dispatch(loadDAppsListActions.submit()), []);

  const styles = useDAppsStyles();

  const DAppsList = useDAppsListSelector();

  const [searchQuery, setSearchQuery] = useState<string>();

  usePageAnalytic(ScreensEnum.DApps);

  const tabletMode = isTablet();

  const texts = useMemo(
    () =>
      tabletMode
        ? ['Other DApps are third-party websites. They should be used at your own risk.']
        : ['Other DApps are third-party websites.', 'They should be used at your own risk.'],
    [tabletMode]
  );

  const sortedDAppsList = useMemo(() => {
    if (isDefined(searchQuery)) {
      return DAppsList.filter(dapp => dapp.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return DAppsList;
  }, [searchQuery, DAppsList]);

  return (
    <>
      <InsetSubstitute type="top" />
      <SearchInput placeholder="Search Dapp" onChangeText={setSearchQuery} />
      <Divider size={formatSize(20)} />
      <Text style={styles.text}>Integrated</Text>
      <Divider size={formatSize(20)} />
      <View style={styles.dappBlockWrapper}>
        <IntegratedDApp
          screenName={ScreensEnum.LiquidityBakingDapp}
          iconName={IconNameEnum.LbDappIcon}
          title="Liquidity Baking"
          descriptions={['Create XTZ/tzBTC & earn XTZ']}
        />
        <Divider size={formatSize(16)} />
        <IntegratedDApp
          screenName={ScreensEnum.KolibriDapp}
          iconName={IconNameEnum.KolibriDappIcon}
          title="Kolibri"
          descriptions={['is an Tezos based stablecoin', 'built on Collaterialized Debt Positions (CDPs)']}
        />
      </View>
      <Divider size={formatSize(20)} />
      <Text style={styles.text}>Others</Text>
      <Divider size={formatSize(8)} />
      <View style={styles.dappBlockWrapper}>
        <Disclaimer texts={texts} />
      </View>
      <Divider size={formatSize(16)} />
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
