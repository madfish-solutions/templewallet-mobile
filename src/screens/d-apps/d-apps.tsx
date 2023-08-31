import { isNonEmptyArray } from '@apollo/client/utilities';
import { BigNumber } from 'bignumber.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, LayoutChangeEvent, ListRenderItem, Text, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
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

import { useTotalBalance } from '../../hooks/use-total-balance';
import { isString } from '../../utils/is-string';
import { DAppsSelectors } from './d-apps.selectors';
import { useDAppsStyles } from './d-apps.styles';
import { IntegratedElement } from './integrated-element/integrated-element';
import { OthersDApp } from './others/others';
import { PromotionCarousel } from './promotion-carousel/promotion-carousel';

const keyExtractor = (item: CustomDAppInfo) => item.name;
const getItemLayout = createGetItemLayout<CustomDAppInfo>(formatSize(7));
const ListEmptyComponent = <DataPlaceholder text="No records found" />;

const gridSize = formatSize(48);

export const DApps = () => {
  const dispatch = useDispatch();

  const { navigate } = useNavigation();

  const styles = useDAppsStyles();

  const dAppsList = useDAppsListSelector();
  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
  const isEnabledAdsBanner = useIsEnabledAdsBannerSelector();
  const { isLoading: isFarmsLoading } = useAllFarmsSelector();
  const isSavingsLoading = useSavingsItemsLoadingSelector();

  const [searchValue, setSearchValue] = useState<string>();
  const [layoutWidth, setLayoutWidth] = useState(1);

  const { balance } = useTotalBalance();
  const { maxApr: farmsMaxApr } = useUserFarmingStats();
  const { maxApr: savingsMaxApr } = useUserSavingsStats();

  usePageAnalytic(ScreensEnum.DApps);

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

  const sortedDAppsList = useMemo(() => {
    if (isDefined(searchValue)) {
      return dAppsList.filter(dapp => dapp.name.toLowerCase().includes(searchValue.toLowerCase()));
    }

    return dAppsList;
  }, [searchValue, dAppsList]);

  const handleLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setLayoutWidth(nativeEvent.layout.width || 1);
  }, []);

  const elementWidth = useMemo(() => (layoutWidth - gridSize) / 2, [layoutWidth]);

  const renderItem: ListRenderItem<CustomDAppInfo> = useCallback(
    item => <OthersDApp item={item} elementWidth={elementWidth} testID={DAppsSelectors.othersDAppsItem} />,
    [elementWidth]
  );

  const tabletMode = isTablet();

  const texts = useMemo(
    () =>
      tabletMode
        ? ['Other DApps are third-party websites. They should be used at your own risk.']
        : ['Other DApps are third-party websites.', 'They should be used at your own risk.'],
    [tabletMode]
  );

  const isListNotEmpty = isNonEmptyArray(sortedDAppsList);

  return (
    <>
      <View onLayout={handleLayout}>
        <InsetSubstitute type="top" />

        <PromotionCarousel />

        <SearchInput
          placeholder="Search Dapps"
          onChangeText={setSearchValue}
          style={styles.searchInput}
          testID={DAppsSelectors.searchDAppsInput}
        />

        {!isString(searchValue) && (
          <View style={styles.wrapper}>
            <Text style={styles.text}>Integrated</Text>

            <IntegratedElement
              iconName={IconNameEnum.EarnDapp}
              title={`Earn up to ${isFarmsLoading || isSavingsLoading ? '---' : maxRoundedApr}% APR`}
              description="Unlock on-chain earning potential"
              navigateFn={() => navigate(ScreensEnum.Earn)}
              backgroundColorStyle={styles.green}
              style={styles.marginBottom}
              testID={DAppsSelectors.earnButton}
              testIDProperties={{
                isZeroBalance: new BigNumber(balance).isLessThanOrEqualTo(0)
              }}
            />

            <IntegratedElement
              iconName={IconNameEnum.TextToNft}
              title="Text to NFT"
              description="Turn text into AI generated NFT"
              navigateFn={() => navigate(ScreensEnum.DApps)}
              backgroundColorStyle={styles.blue}
              testID={DAppsSelectors.integratedDAppButton}
            />
          </View>
        )}

        {isListNotEmpty && (
          <View style={styles.wrapper}>
            <Text style={styles.text}>Others</Text>

            <Disclaimer texts={texts} />
          </View>
        )}
      </View>

      <FlatList
        data={sortedDAppsList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        numColumns={2}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContentContainer}
        columnWrapperStyle={styles.flatListColumnWrapper}
        ListEmptyComponent={ListEmptyComponent}
      />
    </>
  );
};
