import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { BigNumber } from 'bignumber.js';
import { chunk } from 'lodash-es';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { SearchInput } from 'src/components/search-input/search-input';
import { SIDEBAR_WIDTH } from 'src/config/styles';
import { LIMIT_DAPPS_FEATURES } from 'src/config/system';
import { useTotalBalance } from 'src/hooks/use-total-balance';
import { useUserFarmingStats } from 'src/hooks/use-user-farming-stats';
import { useUserSavingsStats } from 'src/hooks/use-user-savings-stats';
import { CustomDAppInfo } from 'src/interfaces/custom-dapps-info.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { loadDAppsListActions } from 'src/store/d-apps/d-apps-actions';
import { useDAppsListSelector } from 'src/store/d-apps/d-apps-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { formatOptionalPercentage } from 'src/utils/earn-opportunities/format.utils';
import { isString } from 'src/utils/is-string';

import { DAppsSelectors } from './d-apps.selectors';
import { useDAppsStyles } from './d-apps.styles';
import { IntegratedDApp } from './integrated/integrated';
import { OthersDApp } from './others/others';
import { PromotionCarousel } from './promotion-carousel/promotion-carousel';

const ITEMS_PER_ROW = 2;
const TABBAR_MARGINS = formatSize(16);
const SIDEBAR_MARGINS = formatSize(51);

const keyExtractor = (item: CustomDAppInfo[]) => item.map(dapp => dapp.name).join('/');
const ListEmptyComponent = <DataPlaceholder text="No records found." />;

export const DApps = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const { width: windowWidth } = useWindowDimensions();

  const { maxApr: farmsMaxApr } = useUserFarmingStats();
  const { maxApr: savingsMaxApr } = useUserSavingsStats();

  const { balance } = useTotalBalance();

  const maxRoundedApr = useMemo(
    () => formatOptionalPercentage(farmsMaxApr && savingsMaxApr && BigNumber.max(farmsMaxApr, savingsMaxApr)),
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

  const sortedDAppsList = useMemo(
    () =>
      isString(searchQuery)
        ? dAppsList.filter(dapp => dapp.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : dAppsList,
    [searchQuery, dAppsList]
  );

  const itemWidth = useMemo(
    () => (isTablet() ? windowWidth - (SIDEBAR_WIDTH + SIDEBAR_MARGINS) : windowWidth - TABBAR_MARGINS) / ITEMS_PER_ROW,
    [windowWidth]
  );

  const data = useMemo(() => chunk(sortedDAppsList, ITEMS_PER_ROW), [sortedDAppsList]);

  const isListNotEmpty = useMemo(() => sortedDAppsList.length > 0, [sortedDAppsList]);

  const renderItem: ListRenderItem<CustomDAppInfo[]> = useCallback(
    ({ item }) => (
      <View style={styles.rowContainer}>
        {item.map((dapp, index) => (
          <OthersDApp key={index} item={dapp} itemWidth={itemWidth} testID={DAppsSelectors.othersDAppsItem} />
        ))}
      </View>
    ),
    [itemWidth]
  );

  const otherDappsHeader = useMemo(() => {
    if (!isListNotEmpty) {
      return null;
    }

    if (LIMIT_DAPPS_FEATURES) {
      return <Text style={styles.text}>Bookmarks</Text>;
    }

    const texts = ['Other DApps are third-party websites.', 'They should be used at your own risk.'];

    return (
      <>
        <Text style={styles.text}>Others</Text>

        <View style={styles.dappBlockWrapper}>
          <Disclaimer texts={tabletMode ? [texts.join(' ')] : texts} />
        </View>
      </>
    );
  }, [isListNotEmpty, tabletMode, styles]);

  return (
    <>
      <InsetSubstitute type="top" />

      <PromotionCarousel />

      <SearchInput
        placeholder={LIMIT_DAPPS_FEATURES ? 'Search' : 'Search Dapps'}
        onChangeText={setSearchQuery}
        testID={DAppsSelectors.searchDAppsInput}
      />

      <Divider size={formatSize(4)} />

      <ScrollView>
        {!isString(searchQuery) && (
          <>
            <Text style={styles.text}>Integrated</Text>

            <IntegratedDApp
              iconName={IconNameEnum.EarnDapp}
              title={`Earn up to ${maxRoundedApr} APR`}
              description="Unlock on-chain earning potential"
              onPress={() => navigate(ScreensEnum.Earn)}
              testID={DAppsSelectors.earnButton}
              testIDProperties={{
                isZeroBalance: new BigNumber(balance).isLessThanOrEqualTo(0)
              }}
            />

            <Divider size={formatSize(8)} />
          </>
        )}

        {otherDappsHeader}

        <FlashList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={ListEmptyComponent}
        />
      </ScrollView>
    </>
  );
};
