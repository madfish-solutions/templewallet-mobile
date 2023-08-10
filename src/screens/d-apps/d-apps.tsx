import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { SearchInput } from 'src/components/search-input/search-input';
import { CustomDAppInfo } from 'src/interfaces/custom-dapps-info.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadDAppsListActions } from 'src/store/d-apps/d-apps-actions';
import { useDAppsListSelector } from 'src/store/d-apps/d-apps-selectors';
import { loadPartnersPromoActions } from 'src/store/partners-promotion/partners-promotion-actions';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { createGetItemLayout } from 'src/utils/flat-list.utils';
import { isString } from 'src/utils/is-string';
import { OptimalPromotionAdType } from 'src/utils/optimal.utils';

import { useIsPartnersPromoEnabledSelector } from '../../store/partners-promotion/partners-promotion-selectors';
import { useIsEnabledAdsBannerSelector } from '../../store/settings/settings-selectors';
import { DAppsSelectors } from './d-apps.selectors';
import { useDAppsStyles } from './d-apps.styles';
import { OthersDApp } from './others/others';
import { PromotionCarousel } from './promotion-carousel/promotion-carousel';

const renderItem: ListRenderItem<CustomDAppInfo> = item => (
  <OthersDApp item={item} testID={DAppsSelectors.othersDAppsItem} />
);
const keyExtractor = (item: CustomDAppInfo) => item.name;
const getItemLayout = createGetItemLayout<CustomDAppInfo>(formatSize(7));
const ListEmptyComponent = <DataPlaceholder text="No records found." />;

export const DApps = () => {
  const dispatch = useDispatch();
  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
  const isEnabledAdsBanner = useIsEnabledAdsBannerSelector();

  useEffect(() => {
    dispatch(loadDAppsListActions.submit());
  }, []);

  useEffect(() => {
    if (partnersPromotionEnabled && !isEnabledAdsBanner) {
      dispatch(loadPartnersPromoActions.submit(OptimalPromotionAdType.TwMobile));
    }
  }, [partnersPromotionEnabled, isEnabledAdsBanner]);

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

  const sortedDAppsList = useMemo(
    () =>
      isString(searchQuery)
        ? dAppsList.filter(dapp => dapp.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : dAppsList,
    [searchQuery, dAppsList]
  );

  return (
    <>
      <InsetSubstitute type="top" />

      <PromotionCarousel />

      <SearchInput placeholder="Search Dapp" onChangeText={setSearchQuery} testID={DAppsSelectors.searchDAppsInput} />

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
      />
    </>
  );
};
