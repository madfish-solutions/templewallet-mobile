import { FlashList, FlashListRef, ListRenderItem } from '@shopify/flash-list';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Checkbox } from 'src/components/checkbox/checkbox';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Divider } from 'src/components/divider/divider';
import { HorizontalBorder } from 'src/components/horizontal-border';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { InAppUpdateBanner } from 'src/components/in-app-update-banner/in-app-update-banner';
import { PromotionItem } from 'src/components/promotion-item';
import { RefreshControl } from 'src/components/refresh-control/refresh-control';
import { Search } from 'src/components/search/search';
import { delegationApy } from 'src/config/general';
import { isAndroid } from 'src/config/system';
import { PromotionProviderEnum } from 'src/enums/promotion-provider.enum';
import { PromotionVariantEnum } from 'src/enums/promotion-variant.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import {
  MultichainDisplayedToken,
  useMultichainDisplayedTokens
} from 'src/hooks/evm/use-multichain-displayed-tokens.hook';
import { useFakeRefreshControlProps } from 'src/hooks/use-fake-refresh-control-props.hook';
import { useInternalAdsAnalyticsWithImpressionCallback } from 'src/hooks/use-internal-ads-analytics.hook';
import { useListElementIntersection } from 'src/hooks/use-list-element-intersection.hook';
import { useIsPartnersPromoShown } from 'src/hooks/use-partners-promo';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen, useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { loadAdvertisingPromotionActions } from 'src/store/advertising/advertising-actions';
import { useSelectedBakerSelector } from 'src/store/baking/baking-selectors';
import { useTokensApyRatesSelector } from 'src/store/d-apps/d-apps-selectors';
import { setZeroBalancesShown } from 'src/store/settings/settings-actions';
import { useHideZeroBalancesSelector, useIsInAppUpdateAvailableSelector } from 'src/store/settings/settings-selectors';
import { useScamTokenSlugsSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useAccountAddressForTezos } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { toChainAssetSlug } from 'src/utils/chain-asset-slug';
import { isString } from 'src/utils/is-string';
import { isPositiveNumber } from 'src/utils/number.util';
import { isAssetSearched } from 'src/utils/token-metadata.utils';

import { WalletSelectors } from '../wallet.selectors';

import { MultichainTokenListItem } from './token-list-item/multichain-token-list-item';
import { useTokenListStyles } from './token-list.styles';

const AD_PLACEHOLDER = 'ad';

const PROMOTION_ID = 'wallet-promotion';

type ListItem = MultichainDisplayedToken | typeof AD_PLACEHOLDER;

const ITEMS_BEFORE_AD = 4;
/** padding size + icon size */
const ITEM_HEIGHT = formatSize(20 + 40);

const FILLER_SLUG_PREFIX = 'filler';

const emptyListItems: ListItem[] = [];

const keyExtractor = (item: ListItem) =>
  item === AD_PLACEHOLDER ? item : toChainAssetSlug(item.chainKind, item.chainId, item.slug);
const getItemType = (item: ListItem) => (typeof item === 'string' ? 'promotion' : 'row');

export const TokensList = memo(() => {
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();
  const navigateToScreen = useNavigateToScreen();
  const { addListener: addNavigationListener, removeListener: removeNavigationListener } = useNavigation();
  const styles = useTokenListStyles();

  const apyRates = useTokensApyRatesSelector();
  const currentBaker = useSelectedBakerSelector();
  const scamTokenSlugsRecord = useScamTokenSlugsSelector();

  const [listHeight, setListHeight] = useState(0);
  const [promotionErrorOccurred, setPromotionErrorOccurred] = useState(false);
  const [searchValue, setSearchValue] = useState<string>();

  const flashListRef = useRef<FlashListRef<ListItem>>(null);
  const adListItemRef = useRef<View>(null);
  const flashListWrapperRef = useRef<View>(null);
  const refs = useMemo(() => ({ parent: flashListWrapperRef, element: adListItemRef }), []);

  const fakeRefreshControlProps = useFakeRefreshControlProps();

  const isHideZeroBalance = useHideZeroBalancesSelector();
  const displayedTokens = useMultichainDisplayedTokens();
  const isInAppUpdateAvailable = useIsInAppUpdateAvailableSelector();
  const publicKeyHash = useAccountAddressForTezos();
  const partnersPromoShown = useIsPartnersPromoShown(PROMOTION_ID, PromotionProviderEnum.HypeLab);

  const adPageName = 'Home page';
  const { onAdLoad, onIsVisible, onAdImpression } = useInternalAdsAnalyticsWithImpressionCallback(
    adPageName,
    PromotionVariantEnum.Text
  );
  const { onListScroll, onElementLayoutChange, onListLayoutChange } = useListElementIntersection(onIsVisible, refs);

  const handleHideZeroBalanceChange = useCallback((value: boolean) => {
    dispatch(setZeroBalancesShown(value));
    trackEvent(WalletSelectors.hideZeroBalancesCheckbox, AnalyticsEventCategory.ButtonPress);
  }, []);

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

  const filteredTokens = useMemo(() => {
    let result = isHideZeroBalance
      ? displayedTokens.filter(token => isPositiveNumber(token.atomicBalance))
      : displayedTokens;

    const lowerCaseSearchValue = searchValue?.toLowerCase();
    if (isString(lowerCaseSearchValue)) {
      result = result.filter(({ name, symbol, slug }) =>
        isAssetSearched({ name, symbol, address: slug }, lowerCaseSearchValue)
      );
    }

    return result;
  }, [displayedTokens, isHideZeroBalance, searchValue]);

  const screenFillingItemsCount = useMemo(() => listHeight / ITEM_HEIGHT, [listHeight]);

  const renderData = useMemo(() => {
    const isNonEmptyList = filteredTokens.length > 0;

    const assetsListWithPromotion = emptyListItems.concat(filteredTokens);
    if (partnersPromoShown && !promotionErrorOccurred) {
      assetsListWithPromotion.splice(isNonEmptyList ? ITEMS_BEFORE_AD : 0, 0, AD_PLACEHOLDER);
    }

    return isNonEmptyList
      ? addPlaceholdersForAndroid(assetsListWithPromotion, screenFillingItemsCount)
      : assetsListWithPromotion;
  }, [filteredTokens, screenFillingItemsCount, partnersPromoShown, promotionErrorOccurred]);

  const shouldShowEmptyListComponent = filteredTokens.length === 0;
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

      if (item.slug.startsWith(FILLER_SLUG_PREFIX)) {
        return <View style={{ height: ITEM_HEIGHT }} />;
      }

      const isTezosItem = item.chainKind === TempleChainKind.Tezos;
      const apy = isTezosItem
        ? item.slug === TEZ_TOKEN_SLUG && currentBaker
          ? delegationApy
          : apyRates[item.slug]
        : undefined;

      return (
        <MultichainTokenListItem
          token={item}
          scam={isTezosItem ? scamTokenSlugsRecord[item.slug] : undefined}
          apy={apy}
        />
      );
    },
    [
      apyRates,
      currentBaker,
      scamTokenSlugsRecord,
      handlePromotionError,
      onAdLoad,
      onElementLayoutChange,
      styles,
      onAdImpression
    ]
  );

  useEffect(() => void flashListRef.current?.scrollToOffset({ animated: true, offset: 0 }), [publicKeyHash]);

  const refreshControl = useMemo(() => <RefreshControl {...fakeRefreshControlProps} />, [fakeRefreshControlProps]);

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

        <Search onChange={setSearchValue} testID={WalletSelectors.searchTokenButton} dividerSize={20}>
          <TouchableIcon
            name={IconNameEnum.Clock}
            size={formatSize(16)}
            onPress={() => navigateToScreen({ screen: ScreensEnum.Activity })}
          />
          <Divider size={formatSize(24)} />
          <TouchableIcon
            name={IconNameEnum.Edit}
            size={formatSize(16)}
            onPress={() => navigateToScreen({ screen: ScreensEnum.ManageAssets, params: { collectibles: false } })}
          />
        </Search>
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

const buildFillerToken = (index: number): MultichainDisplayedToken => ({
  slug: `${FILLER_SLUG_PREFIX}${index}`,
  chainKind: TempleChainKind.Tezos,
  chainId: '',
  symbol: '',
  name: '',
  atomicBalance: '0',
  decimals: 0,
  fiatValue: undefined
});

const addPlaceholdersForAndroid = (listData: ListItem[], screenFillingItemsCount: number) =>
  isAndroid && screenFillingItemsCount > listData.length
    ? listData.concat(
        Array(Math.ceil(screenFillingItemsCount - listData.length))
          .fill(null)
          .map((_, index) => buildFillerToken(index))
      )
    : listData;
