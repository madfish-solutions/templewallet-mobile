import { FlashList, FlashListRef, ListRenderItem } from '@shopify/flash-list';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { HorizontalBorder } from 'src/components/horizontal-border';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { InAppUpdateBanner } from 'src/components/in-app-update-banner/in-app-update-banner';
import { PromotionItem } from 'src/components/promotion-item';
import { RefreshControl } from 'src/components/refresh-control/refresh-control';
import { SearchInput } from 'src/components/search-input/search-input';
import { isAndroid } from 'src/config/system';
import { PromotionProviderEnum } from 'src/enums/promotion-provider.enum';
import { PromotionVariantEnum } from 'src/enums/promotion-variant.enum';
import { useFakeRefreshControlProps } from 'src/hooks/use-fake-refresh-control-props.hook';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { useInternalAdsAnalyticsWithImpressionCallback } from 'src/hooks/use-internal-ads-analytics.hook';
import { useListElementIntersection } from 'src/hooks/use-list-element-intersection.hook';
import { useIsPartnersPromoShown } from 'src/hooks/use-partners-promo';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen, useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { loadAdvertisingPromotionActions } from 'src/store/advertising/advertising-actions';
import { useTokensApyRatesSelector } from 'src/store/d-apps/d-apps-selectors';
import { useHideZeroBalancesSelector, useIsInAppUpdateAvailableSelector } from 'src/store/settings/settings-selectors';
import { useScamTokenSlugsSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useAccountAddressForTezos } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { emptyToken, TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { useAccountTkeyToken, useCurrentAccountTokens } from 'src/utils/assets/hooks';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { ActionButton } from '../action-button';
import { WalletSelectors } from '../wallet.selectors';

import { TezosToken } from './token-list-item/tezos-token';
import { TokenListItem } from './token-list-item/token-list-item';
import { useTokenListStyles } from './token-list.styles';

const AD_PLACEHOLDER = 'ad';

const PROMOTION_ID = 'wallet-promotion';

type ListItem = TokenInterface | typeof AD_PLACEHOLDER;

const ITEMS_BEFORE_AD = 4;
/** padding size + icon size */
const ITEM_HEIGHT = formatSize(24 + 32);

const keyExtractor = (item: ListItem) => (item === AD_PLACEHOLDER ? item : getTokenSlug(item));
const getItemType = (item: ListItem) => (typeof item === 'string' ? 'promotion' : 'row');

export const TokensList = memo(() => {
  const dispatch = useDispatch();
  const navigateToScreen = useNavigateToScreen();
  const { addListener: addNavigationListener, removeListener: removeNavigationListener } = useNavigation();
  const styles = useTokenListStyles();

  const apyRates = useTokensApyRatesSelector();
  const scamTokenSlugsRecord = useScamTokenSlugsSelector();

  const [listHeight, setListHeight] = useState(0);
  const [promotionErrorOccurred, setPromotionErrorOccurred] = useState(false);

  const flashListRef = useRef<FlashListRef<ListItem>>(null);
  const adListItemRef = useRef<View>(null);
  const flashListWrapperRef = useRef<View>(null);
  const refs = useMemo(() => ({ parent: flashListWrapperRef, element: adListItemRef }), []);

  const fakeRefreshControlProps = useFakeRefreshControlProps();

  const tezosToken = useTezosTokenOfCurrentAccount();
  const tkeyToken = useAccountTkeyToken();
  const isHideZeroBalance = useHideZeroBalancesSelector();
  const visibleTokensList = useCurrentAccountTokens(true);
  const isInAppUpdateAvailable = useIsInAppUpdateAvailableSelector();
  const publicKeyHash = useAccountAddressForTezos();
  const partnersPromoShown = useIsPartnersPromoShown(PROMOTION_ID, PromotionProviderEnum.HypeLab);

  const adPageName = 'Home page';
  const { onAdLoad, onIsVisible, onAdImpression } = useInternalAdsAnalyticsWithImpressionCallback(
    adPageName,
    PromotionVariantEnum.Text
  );
  const { onListScroll, onElementLayoutChange, onListLayoutChange } = useListElementIntersection(onIsVisible, refs);

  useEffect(() => {
    const listener = () => {
      if (partnersPromoShown) {
        setPromotionErrorOccurred(false);
      }
    };

    if (partnersPromoShown) {
      addNavigationListener('focus', listener);
    }

    return () => {
      removeNavigationListener('focus', listener);
    };
  }, [dispatch, addNavigationListener, removeNavigationListener, partnersPromoShown]);

  useEffect(() => {
    if (partnersPromoShown) {
      dispatch(loadAdvertisingPromotionActions.submit());
    }
  }, [dispatch, partnersPromoShown]);

  const leadingAssets = useMemo(() => [tezosToken, tkeyToken], [tezosToken, tkeyToken]);

  const { filteredAssetsList, setSearchValue, searchValue } = useFilteredAssetsList(
    visibleTokensList,
    isHideZeroBalance,
    true,
    leadingAssets
  );

  const screenFillingItemsCount = useMemo(() => listHeight / ITEM_HEIGHT, [listHeight]);

  const renderData = useMemo(() => {
    const isNonEmptyList = filteredAssetsList.length > 0;

    const assetsListWithPromotion: ListItem[] = [...filteredAssetsList];
    if (partnersPromoShown && !promotionErrorOccurred) {
      assetsListWithPromotion.splice(isNonEmptyList ? ITEMS_BEFORE_AD : 0, 0, AD_PLACEHOLDER);
    }

    return isNonEmptyList
      ? addPlaceholdersForAndroid(assetsListWithPromotion, screenFillingItemsCount)
      : assetsListWithPromotion;
  }, [filteredAssetsList, screenFillingItemsCount, partnersPromoShown, promotionErrorOccurred]);

  const shouldShowEmptyListComponent = filteredAssetsList.length === 0;
  const isNonEmptyRenderList = renderData.length > 1;

  const handleLayout = useCallback((event: LayoutChangeEvent) => setListHeight(event.nativeEvent.layout.height), []);
  const handlePromotionError = useCallback(() => setPromotionErrorOccurred(true), []);

  const renderItem: ListRenderItem<ListItem> = useCallback(
    ({ item, index }) => {
      if (item === AD_PLACEHOLDER) {
        return (
          <View onLayout={onElementLayoutChange} ref={adListItemRef}>
            <View style={styles.promotionItemWrapper}>
              <PromotionItem
                id={PROMOTION_ID}
                variant={PromotionVariantEnum.Text}
                style={styles.promotionItem}
                testID={WalletSelectors.promotion}
                pageName={adPageName}
                onError={handlePromotionError}
                onLoad={onAdLoad}
                onImpression={onAdImpression}
              />
            </View>
            {index !== 0 && <HorizontalBorder style={styles.promotionItemBorder} />}
          </View>
        );
      }

      const slug = getTokenSlug(item);

      if (slug === TEZ_TOKEN_SLUG) {
        return <TezosToken />;
      }

      if (item.address.startsWith('filler')) {
        return <View style={{ height: ITEM_HEIGHT }} />;
      }

      return <TokenListItem token={item} scam={scamTokenSlugsRecord[slug]} apy={apyRates[slug]} />;
    },
    [apyRates, scamTokenSlugsRecord, handlePromotionError, onAdLoad, onElementLayoutChange, styles, onAdImpression]
  );

  useEffect(() => void flashListRef.current?.scrollToOffset({ animated: true, offset: 0 }), [publicKeyHash]);

  const refreshControl = useMemo(() => <RefreshControl {...fakeRefreshControlProps} />, [fakeRefreshControlProps]);

  const navigateToActivity = useCallback(() => navigateToScreen({ screen: ScreensEnum.Activity }), [navigateToScreen]);
  const navigateToManageAssets = useCallback(
    () => navigateToScreen({ screen: ScreensEnum.ManageAssets, params: { collectibles: false } }),
    [navigateToScreen]
  );

  return (
    <>
      <View style={styles.headerContainer}>
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          testID={WalletSelectors.searchTokenButton}
          containerStyle={styles.searchInputContainer}
          placeholder="Search"
        />
        <ActionButton iconName={IconNameV2Enum.Clock} onPress={navigateToActivity} />
        <ActionButton iconName={IconNameV2Enum.Slider} onPress={navigateToManageAssets} />
      </View>

      {isInAppUpdateAvailable ? <InAppUpdateBanner style={styles.banner} /> : null}

      <View
        style={isNonEmptyRenderList ? styles.listContainer : styles.listContainerWithAd}
        ref={flashListWrapperRef}
        onLayout={handleLayout}
        testID={WalletSelectors.tokenList}
      >
        <FlashList
          ref={flashListRef}
          data={renderData}
          scrollEnabled={isNonEmptyRenderList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          refreshControl={refreshControl}
          onScroll={onListScroll}
          onLayout={onListLayoutChange}
        />
      </View>
      {shouldShowEmptyListComponent && <DataPlaceholder text="No records found." />}
    </>
  );
});

const addPlaceholdersForAndroid = (listData: ListItem[], screenFillingItemsCount: number) =>
  isAndroid && screenFillingItemsCount > listData.length
    ? listData.concat(
        Array(Math.ceil(screenFillingItemsCount - listData.length))
          .fill(emptyToken)
          .map((token, index) => ({ ...token, address: `filler${index}` }))
      )
    : listData;
