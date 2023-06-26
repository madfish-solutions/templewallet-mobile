import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, LayoutChangeEvent, ListRenderItem, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Checkbox } from 'src/components/checkbox/checkbox';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { OptimalPromotionItem } from 'src/components/optimal-promotion-item/optimal-promotion-item';
import { OptimalPromotionVariantEnum } from 'src/components/optimal-promotion-item/optimal-promotion-variant.enum';
import { RefreshControl } from 'src/components/refresh-control/refresh-control';
import { Search } from 'src/components/search/search';
import { isAndroid } from 'src/config/system';
import { useFakeRefreshControlProps } from 'src/hooks/use-fake-refresh-control-props.hook';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useTokensApyRatesSelector } from 'src/store/d-apps/d-apps-selectors';
import {
  loadPartnersPromoActions,
  togglePartnersPromotionAction
} from 'src/store/partners-promotion/partners-promotion-actions';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { setAdsBannerVisibilityAction, setZeroBalancesShown } from 'src/store/settings/settings-actions';
import { useHideZeroBalancesSelector, useIsEnabledAdsBannerSelector } from 'src/store/settings/settings-selectors';
import {
  useSelectedAccountSelector,
  useSelectedAccountTezosTokenSelector,
  useVisibleTokensListSelector
} from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { emptyToken, TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { createGetItemLayout } from 'src/utils/flat-list.utils';
import { OptimalPromotionAdType } from 'src/utils/optimal.utils';

import { optimalFetchEnableAds } from '../../../apis/optimal';
import { Banner } from '../../../components/banner/banner';
import { loadAdvertisingPromotionActions } from '../../../store/advertising/advertising-actions';
import { WalletSelectors } from '../wallet.selectors';
import { TezosToken } from './token-list-item/tezos-token';
import { TokenListItem } from './token-list-item/token-list-item';
import { useTokenListStyles } from './token-list.styles';

const AD_PLACEHOLDER = 'ad';

type FlatListItem = TokenInterface | typeof AD_PLACEHOLDER;

const ITEMS_BEFORE_AD = 4;
// padding size + icon size
const ITEM_HEIGHT = formatSize(24) + formatSize(32);
const keyExtractor = (item: FlatListItem) => (item === AD_PLACEHOLDER ? item : getTokenSlug(item));
const getItemLayout = createGetItemLayout<FlatListItem>(ITEM_HEIGHT);

export const TokensList: FC = () => {
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();
  const { navigate, addListener: addNavigationListener, removeListener: removeNavigationListener } = useNavigation();
  const styles = useTokenListStyles();

  const apyRates = useTokensApyRatesSelector();

  const [flatlistHeight, setFlatlistHeight] = useState(0);
  const [promotionErrorOccurred, setPromotionErrorOccurred] = useState(false);
  const fakeRefreshControlProps = useFakeRefreshControlProps();

  const tezosToken = useSelectedAccountTezosTokenSelector();
  const isHideZeroBalance = useHideZeroBalancesSelector();
  const visibleTokensList = useVisibleTokensListSelector();
  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();

  const { publicKeyHash } = useSelectedAccountSelector();

  const isEnabledAdsBanner = useIsEnabledAdsBannerSelector();

  const handleHideZeroBalanceChange = useCallback((value: boolean) => {
    dispatch(setZeroBalancesShown(value));
    trackEvent(WalletSelectors.hideZeroBalancesCheckbox, AnalyticsEventCategory.ButtonPress);
  }, []);

  useEffect(() => {
    const listener = () => {
      dispatch(loadPartnersPromoActions.submit(OptimalPromotionAdType.TwToken));
      setPromotionErrorOccurred(false);
    };

    if (partnersPromotionEnabled) {
      addNavigationListener('focus', listener);
    }

    return () => {
      removeNavigationListener('focus', listener);
    };
  }, [dispatch, addNavigationListener, removeNavigationListener, partnersPromotionEnabled]);

  useEffect(() => {
    if (partnersPromotionEnabled && !isEnabledAdsBanner) {
      dispatch(loadAdvertisingPromotionActions.submit());
      optimalFetchEnableAds(publicKeyHash);
    }
  }, [partnersPromotionEnabled, isEnabledAdsBanner]);

  const { filteredAssetsList, searchValue, setSearchValue } = useFilteredAssetsList(
    visibleTokensList,
    isHideZeroBalance,
    true,
    tezosToken
  );

  const screenFillingItemsCount = useMemo(() => flatlistHeight / ITEM_HEIGHT, [flatlistHeight]);

  const renderData = useMemo(() => {
    const shouldHidePromotion =
      (isHideZeroBalance && filteredAssetsList.length === 0) ||
      (searchValue?.length ?? 0) > 0 ||
      !partnersPromotionEnabled;

    const assetsListWithPromotion: FlatListItem[] = [...filteredAssetsList];
    if (!shouldHidePromotion && !promotionErrorOccurred) {
      assetsListWithPromotion.splice(ITEMS_BEFORE_AD, 0, AD_PLACEHOLDER);
    }

    return addPlaceholdersForAndroid(assetsListWithPromotion, screenFillingItemsCount);
  }, [
    filteredAssetsList,
    screenFillingItemsCount,
    isHideZeroBalance,
    partnersPromotionEnabled,
    promotionErrorOccurred,
    searchValue
  ]);

  const handleLayout = (event: LayoutChangeEvent) => setFlatlistHeight(event.nativeEvent.layout.height);

  const handleDisableBannerButton = () => {
    dispatch(togglePartnersPromotionAction(false));
    dispatch(setAdsBannerVisibilityAction(false));
  };

  const handleEnableBannerButton = async () => {
    dispatch(togglePartnersPromotionAction(true));
    dispatch(setAdsBannerVisibilityAction(false));
  };

  const renderItem: ListRenderItem<FlatListItem> = useCallback(
    ({ item }) => {
      if (item === AD_PLACEHOLDER) {
        return (
          <View>
            <View style={styles.promotionItemWrapper}>
              <OptimalPromotionItem
                variant={OptimalPromotionVariantEnum.Text}
                style={styles.promotionItem}
                testID={WalletSelectors.promotion}
                onEmptyPromotionReceived={() => setPromotionErrorOccurred(true)}
                onImageError={() => setPromotionErrorOccurred(true)}
              />
            </View>
            <View style={isAndroid ? styles.promotionItemBorderAndroid : styles.promotionItemBorderIOS} />
          </View>
        );
      }

      const slug = getTokenSlug(item);

      if (slug === TEZ_TOKEN_SLUG) {
        return <TezosToken />;
      }

      if (item.address.startsWith('filler') === true) {
        return <View style={{ height: ITEM_HEIGHT }} />;
      }

      return <TokenListItem token={item} apy={apyRates[slug]} />;
    },
    [apyRates, styles]
  );

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.hideZeroBalanceContainer}>
          <Checkbox
            value={isHideZeroBalance}
            size={formatSize(16)}
            strokeWidth={formatSize(2)}
            onChange={handleHideZeroBalanceChange}
            testID={WalletSelectors.hideZeroBalancesCheckbox}
          >
            <Divider size={formatSize(4)} />
            <Text style={styles.hideZeroBalanceText}>Hide 0 balance</Text>
          </Checkbox>
        </View>

        <Search onChange={setSearchValue} testID={WalletSelectors.searchTokenButton}>
          <TouchableIcon
            name={IconNameEnum.Clock}
            size={formatSize(16)}
            onPress={() => navigate(ScreensEnum.Activity)}
          />
          <Divider size={formatSize(24)} />
          <TouchableIcon
            name={IconNameEnum.Edit}
            size={formatSize(16)}
            onPress={() => navigate(ScreensEnum.ManageAssets)}
          />
        </Search>
      </View>

      {isEnabledAdsBanner && (
        <Banner
          title="Earn by viewing ads in Temple Wallet"
          description="Support the development team and earn tokens by viewing ads inside the wallet. To enable this feature, we request your permission to trace your Wallet Address and IP address. You can always disable ads in the settings."
          enableButtonText="Enable ADS"
          onDisable={handleDisableBannerButton}
          onEnable={handleEnableBannerButton}
          style={styles.banner}
        />
      )}

      <View style={styles.contentContainerStyle} onLayout={handleLayout} testID={WalletSelectors.tokenList}>
        <FlatList
          scrollEnabled
          data={renderData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          ListEmptyComponent={<DataPlaceholder text="No records found." />}
          windowSize={11}
          updateCellsBatchingPeriod={150}
          refreshControl={<RefreshControl {...fakeRefreshControlProps} />}
        />
      </View>
    </>
  );
};

const addPlaceholdersForAndroid = (flatListData: FlatListItem[], screenFillingItemsCount: number) =>
  isAndroid && screenFillingItemsCount > flatListData.length
    ? flatListData.concat(
        Array(Math.ceil(screenFillingItemsCount - flatListData.length))
          .fill(emptyToken)
          .map((token, index) => ({ ...token, address: `filler${index}` }))
      )
    : flatListData;
