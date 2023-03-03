import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { Disclaimer } from '../../components/disclaimer/disclaimer';
import { Divider } from '../../components/divider/divider';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { SearchInput } from '../../components/search-input/search-input';
import { CustomDAppInfo } from '../../interfaces/custom-dapps-info.interface';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { loadDAppsListActions } from '../../store/d-apps/d-apps-actions';
import { useDAppsListSelector } from '../../store/d-apps/d-apps-selectors';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { createGetItemLayout } from '../../utils/flat-list.utils';
import { isDefined } from '../../utils/is-defined';
import { DAppsSelectors } from './d-apps.selectors';
import { useDAppsStyles } from './d-apps.styles';
import { IntegratedDApp } from './integrated/integrated';
import { OthersDApp } from './others/others';

const renderItem: ListRenderItem<CustomDAppInfo> = item => <OthersDApp item={item} />;
const keyExtractor = (item: CustomDAppInfo) => item.name;
const getItemLayout = createGetItemLayout<CustomDAppInfo>(formatSize(7));
const ListEmptyComponent = <DataPlaceholder text="No records found." />;

export const DApps = () => {
  const dispatch = useDispatch();
  useEffect(() => void dispatch(loadDAppsListActions.submit()), []);

  const styles = useDAppsStyles();

  const dAppsList = useDAppsListSelector();

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
      return dAppsList.filter(dapp => dapp.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return dAppsList;
  }, [searchQuery, dAppsList]);

  return (
    <>
      <InsetSubstitute type="top" />
      <SearchInput placeholder="Search Dapp" onChangeText={setSearchQuery} testID={DAppsSelectors.searchDAppsInput} />
      <Divider size={formatSize(20)} />
      <Text style={styles.text}>Integrated</Text>
      <Divider size={formatSize(20)} />
      <View style={styles.dappBlockWrapper}>
        <IntegratedDApp
          screenName={ScreensEnum.LiquidityBakingDapp}
          iconName={IconNameEnum.LbDappIcon}
          title="Liquidity Baking"
          description="Create XTZ/tzBTC & earn XTZ"
          testID={DAppsSelectors.integratedDAppButton}
        />
      </View>
      <Divider size={formatSize(20)} />
      <Text style={styles.text}>Others</Text>
      <Divider size={formatSize(8)} />
      <View style={styles.dappBlockWrapper}>
        <Disclaimer texts={texts} />
      </View>
      <Divider size={formatSize(16)} />
      <FlatList
        data={sortedDAppsList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        numColumns={2}
        contentContainerStyle={styles.container}
        ListEmptyComponent={ListEmptyComponent}
        testID={DAppsSelectors.othersDAppsItem}
      />
    </>
  );
};
