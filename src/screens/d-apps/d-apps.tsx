import { BigNumber } from 'bignumber.js';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { SearchInput } from 'src/components/search-input/search-input';
import { PERCENTAGE_DECIMALS } from 'src/config/earn-opportunities';
import { useUserFarmingStats } from 'src/hooks/use-user-farming-stats';
import { useUserSavingsStats } from 'src/hooks/use-user-savings-stats';
import { CustomDAppInfo } from 'src/interfaces/custom-dapps-info.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { loadDAppsListActions } from 'src/store/d-apps/d-apps-actions';
import { useDAppsListSelector } from 'src/store/d-apps/d-apps-selectors';
import { useAllFarmsSelector } from 'src/store/farms/selectors';
import { loadPartnersPromoActions } from 'src/store/partners-promotion/partners-promotion-actions';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { useSavingsItemsLoadingSelector } from 'src/store/savings/selectors';
import { useIsEnabledAdsBannerSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { createGetItemLayout } from 'src/utils/flat-list.utils';
import { isDefined } from 'src/utils/is-defined';
import { OptimalPromotionAdType } from 'src/utils/optimal.utils';

import { DAppsSelectors } from './d-apps.selectors';
import { useDAppsStyles } from './d-apps.styles';
import { IntegratedDApp } from './integrated/integrated';
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
  const { navigate } = useNavigation();
  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
  const isEnabledAdsBanner = useIsEnabledAdsBannerSelector();

  const { isLoading: isFarmsLoading } = useAllFarmsSelector();
  const isSavingsLoading = useSavingsItemsLoadingSelector();

  const { maxApr: farmsMaxApr } = useUserFarmingStats();
  const { maxApr: savingsMaxApr } = useUserSavingsStats();

  const maxRoundedApr = useMemo(
    () => BigNumber.max(farmsMaxApr, savingsMaxApr).toFixed(PERCENTAGE_DECIMALS),
    [farmsMaxApr, savingsMaxApr]
  );

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

  const sortedDAppsList = useMemo(() => {
    if (isDefined(searchQuery)) {
      return dAppsList.filter(dapp => dapp.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return dAppsList;
  }, [searchQuery, dAppsList]);

  return (
    <>
      <InsetSubstitute type="top" />
      <PromotionCarousel />
      <SearchInput placeholder="Search Dapp" onChangeText={setSearchQuery} testID={DAppsSelectors.searchDAppsInput} />
      <Divider size={formatSize(24)} />
      <Text style={styles.text}>Integrated</Text>
      <Divider size={formatSize(12)} />
      <IntegratedDApp
        iconName={IconNameEnum.EarnDapp}
        title={`Earn up to ${isFarmsLoading || isSavingsLoading ? '---' : maxRoundedApr}% APR`}
        description="Unlock on-chain earning potential"
        onPress={() => navigate(ScreensEnum.Earn)}
      />
      <Divider size={formatSize(20)} />
      <Text style={styles.text}>Others</Text>
      <Divider size={formatSize(12)} />
      <View style={styles.dappBlockWrapper}>
        <Disclaimer texts={texts} />
      </View>
      <Divider size={formatSize(12)} />
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
