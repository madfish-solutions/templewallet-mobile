import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
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
import { isDefined } from 'src/utils/is-defined';
import { OptimalPromotionAdType } from 'src/utils/optimal.utils';

import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useIsPartnersPromoEnabledSelector } from '../../store/partners-promotion/partners-promotion-selectors';
import { useIsEnabledAdsBannerSelector } from '../../store/settings/settings-selectors';
import { isString } from '../../utils/is-string';
import { DAppsSelectors } from './d-apps.selectors';
import { useDAppsStyles } from './d-apps.styles';
import { IntegratedElement } from './integrated-element/integrated-element';
import { OthersDApp } from './others/others';
import { PromotionCarousel } from './promotion-carousel/promotion-carousel';

const keyExtractor = (item: CustomDAppInfo) => item.name;
const getItemLayout = createGetItemLayout<CustomDAppInfo>(formatSize(7));
const ListEmptyComponent = <DataPlaceholder text="No records found." />;

export const DApps = () => {
  const dispatch = useDispatch();
  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
  const isEnabledAdsBanner = useIsEnabledAdsBannerSelector();
  const { navigate } = useNavigation();

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

  const [searchValue, setSearchValue] = useState<string>();

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
    if (isDefined(searchValue)) {
      return dAppsList.filter(dapp => dapp.name.toLowerCase().includes(searchValue.toLowerCase()));
    }

    return dAppsList;
  }, [searchValue, dAppsList]);

  const renderItem: ListRenderItem<CustomDAppInfo> = useCallback(
    item => (
      <OthersDApp
        item={item}
        style={[item.index % 2 === 0 && styles.marginRight]}
        testID={DAppsSelectors.othersDAppsItem}
      />
    ),
    []
  );

  return (
    <>
      <InsetSubstitute type="top" />

      <PromotionCarousel />

      <SearchInput
        placeholder="Search Dapp"
        onChangeText={setSearchValue}
        style={styles.searchInput}
        testID={DAppsSelectors.searchDAppsInput}
      />

      {!isString(searchValue) && (
        <View style={styles.wrapper}>
          <Text style={styles.text}>Integrated</Text>

          <IntegratedElement
            screenName={ScreensEnum.DApps}
            iconName={IconNameEnum.TextToNft}
            title="Text to NFT"
            description="Turn text into AI generated NFT"
            navigateFn={() => navigate(ScreensEnum.DApps)}
            testID={DAppsSelectors.integratedDAppButton}
          />
        </View>
      )}

      <View style={styles.wrapper}>
        <Text style={styles.text}>Others</Text>

        <Disclaimer texts={texts} />
      </View>

      <FlatList
        data={sortedDAppsList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        numColumns={2}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContentContainer}
        ListEmptyComponent={ListEmptyComponent}
      />
    </>
  );
};
