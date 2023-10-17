import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { BigNumber } from 'bignumber.js';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { SearchInput } from 'src/components/search-input/search-input';
import { PERCENTAGE_DECIMALS } from 'src/config/earn-opportunities';
import { useTotalBalance } from 'src/hooks/use-total-balance';
import { useUserFarmingStats } from 'src/hooks/use-user-farming-stats';
import { useUserSavingsStats } from 'src/hooks/use-user-savings-stats';
import { CustomDAppInfo } from 'src/interfaces/custom-dapps-info.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { loadDAppsListActions } from 'src/store/d-apps/d-apps-actions';
import { useDAppsListSelector } from 'src/store/d-apps/d-apps-selectors';
import { useAllFarmsSelector } from 'src/store/farms/selectors';
import { useSavingsItemsLoadingSelector } from 'src/store/savings/selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isString } from 'src/utils/is-string';

import { DAppsSelectors } from './d-apps.selectors';
import { useDAppsStyles } from './d-apps.styles';
import { IntegratedDApp } from './integrated/integrated';
import { OthersDApp } from './others/others';
import { PromotionCarousel } from './promotion-carousel/promotion-carousel';

const renderItem: ListRenderItem<CustomDAppInfo> = ({ item }) => (
  <OthersDApp item={item} testID={DAppsSelectors.othersDAppsItem} />
);
const keyExtractor = (item: CustomDAppInfo) => item.name;
const ListEmptyComponent = <DataPlaceholder text="No records found." />;

export const DApps = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const { isLoading: isFarmsLoading } = useAllFarmsSelector();
  const isSavingsLoading = useSavingsItemsLoadingSelector();

  const { maxApr: farmsMaxApr } = useUserFarmingStats();
  const { maxApr: savingsMaxApr } = useUserSavingsStats();

  const { balance } = useTotalBalance();

  const maxRoundedApr = useMemo(
    () => BigNumber.max(farmsMaxApr, savingsMaxApr).toFixed(PERCENTAGE_DECIMALS),
    [farmsMaxApr, savingsMaxApr]
  );

  useEffect(() => {
    dispatch(loadDAppsListActions.submit());
  }, []);

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

      <Divider size={formatSize(12)} />

      <Text style={styles.text}>Integrated</Text>

      <Divider size={formatSize(12)} />

      <IntegratedDApp
        iconName={IconNameEnum.EarnDapp}
        title={`Earn up to ${isFarmsLoading || isSavingsLoading ? '---' : maxRoundedApr}% APR`}
        description="Unlock on-chain earning potential"
        onPress={() => navigate(ScreensEnum.Earn)}
        testID={DAppsSelectors.earnButton}
        testIDProperties={{
          isZeroBalance: new BigNumber(balance).isLessThanOrEqualTo(0)
        }}
      />

      <Divider size={formatSize(20)} />

      <Text style={styles.text}>Others</Text>

      <Divider size={formatSize(12)} />

      <View style={styles.dappBlockWrapper}>
        <Disclaimer texts={texts} />
      </View>

      <Divider size={formatSize(20)} />

      <FlashList
        data={sortedDAppsList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={ListEmptyComponent}
      />
    </>
  );
};
