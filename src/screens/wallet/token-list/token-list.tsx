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
import { loadPartnersPromoActions } from 'src/store/partners-promotion/partners-promotion-actions';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { setZeroBalancesShown } from 'src/store/settings/settings-actions';
import { useHideZeroBalancesSelector } from 'src/store/settings/settings-selectors';
import { useSelectedAccountTezosTokenSelector, useVisibleTokensListSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize, formatSizeScaled } from 'src/styles/format-size';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { emptyToken, TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { createGetItemLayout } from 'src/utils/flat-list.utils';
import { OptimalPromotionAdType } from 'src/utils/optimal.utils';

import { TezosToken } from './token-list-item/tezos-token';
import { TokenListItem } from './token-list-item/token-list-item';
import { TokenListSelectors } from './token-list.selectors';
import { useTokenListStyles } from './token-list.styles';

type FlatListItem = TokenInterface | typeof TEZ_TOKEN_SLUG;
const keyExtractor = (item: FlatListItem) => {
  if (item === TEZ_TOKEN_SLUG) {
    return TEZ_TOKEN_SLUG;
  }

  return getTokenSlug(item);
};

// padding size + icon size
const ITEM_HEIGHT = formatSize(24) + formatSizeScaled(32);
const getItemLayout = createGetItemLayout<FlatListItem>(ITEM_HEIGHT);
const ITEMS_BEFORE_AD = 4;

export const TokensList: FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { navigate } = navigation;
  const styles = useTokenListStyles();

  const apyRates = useTokensApyRatesSelector();

  const [flatlistHeight, setFlatlistHeight] = useState(0);
  const fakeRefreshControlProps = useFakeRefreshControlProps();

  const tezosToken = useSelectedAccountTezosTokenSelector();
  const isHideZeroBalance = useHideZeroBalancesSelector();
  const visibleTokensList = useVisibleTokensListSelector();
  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();

  const handleHideZeroBalanceChange = useCallback((value: boolean) => {
    dispatch(setZeroBalancesShown(value));
  }, []);

  const { filteredAssetsList, searchValue, setSearchValue } = useFilteredAssetsList(
    visibleTokensList,
    isHideZeroBalance,
    true,
    tezosToken
  );

  const screenFillingItemsCount = useMemo(() => flatlistHeight / ITEM_HEIGHT, [flatlistHeight]);

  const renderData = useMemo(() => {
    const noAdsData = addPlaceholdersForAndroid(filteredAssetsList, screenFillingItemsCount);

    if (
      (isHideZeroBalance && filteredAssetsList.length === 0) ||
      (searchValue?.length ?? 0) > 0 ||
      !partnersPromotionEnabled
    ) {
      return noAdsData;
    }

    return [
      ...noAdsData.slice(0, ITEMS_BEFORE_AD),
      { ...emptyToken, address: 'ad' },
      ...noAdsData.slice(ITEMS_BEFORE_AD, noAdsData.length)
    ];
  }, [filteredAssetsList, screenFillingItemsCount, isHideZeroBalance, partnersPromotionEnabled, searchValue]);

  useEffect(() => {
    const listener = () => {
      dispatch(loadPartnersPromoActions.submit(OptimalPromotionAdType.TwToken));
    };
    navigation.addListener('focus', listener);

    return () => {
      navigation.removeListener('focus', listener);
    };
  }, [dispatch, navigation]);

  const handleLayout = (event: LayoutChangeEvent) => setFlatlistHeight(event.nativeEvent.layout.height);

  const renderFlatListItem: ListRenderItem<FlatListItem> = useCallback(
    ({ item }) => {
      if (item === TEZ_TOKEN_SLUG) {
        return <TezosToken />;
      }

      if (item.address === 'ad') {
        return (
          <>
            <View style={styles.promotionItemWrapper}>
              <OptimalPromotionItem
                variant={OptimalPromotionVariantEnum.Text}
                style={styles.promotionItem}
                testID={TokenListSelectors.promotion}
              />
            </View>
            <View style={styles.promotionItemBorder} />
          </>
        );
      }

      if (item.address.startsWith('filler') === true) {
        return <View style={{ height: ITEM_HEIGHT }} />;
      }

      return <TokenListItem token={item} apy={apyRates[getTokenSlug(item)]} />;
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
            testID={TokenListSelectors.hideZeroBalanceCheckBox}
          >
            <Divider size={formatSize(4)} />
            <Text style={styles.hideZeroBalanceText}>Hide 0 balance</Text>
          </Checkbox>
        </View>

        <Search onChange={setSearchValue}>
          <TouchableIcon
            name={IconNameEnum.Clock}
            size={formatSize(16)}
            onPress={() => navigate(ScreensEnum.Activity)}
            testID={TokenListSelectors.activityButton}
          />
          <Divider size={formatSize(24)} />
          <TouchableIcon
            name={IconNameEnum.Edit}
            size={formatSize(16)}
            onPress={() => navigate(ScreensEnum.ManageAssets)}
            testID={TokenListSelectors.manageAssetsButton}
          />
        </Search>
      </View>

      <View style={styles.contentContainerStyle} onLayout={handleLayout} testID={TokenListSelectors.tokenList}>
        <FlatList
          scrollEnabled
          data={renderData}
          renderItem={renderFlatListItem}
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
