import React, { FC, useCallback, useMemo, useState } from 'react';
import { FlatList, LayoutChangeEvent, ListRenderItem, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Checkbox } from '../../../components/checkbox/checkbox';
import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { Divider } from '../../../components/divider/divider';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../components/icon/touchable-icon/touchable-icon';
import { RefreshControl } from '../../../components/refresh-control/refresh-control';
import { Search } from '../../../components/search/search';
import { isAndroid } from '../../../config/system';
import { useFakeRefreshControlProps } from '../../../hooks/use-fake-refresh-control-props.hook';
import { useFilteredAssetsList } from '../../../hooks/use-filtered-assets-list.hook';
import { useNetworkInfo } from '../../../hooks/use-network-info.hook';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { useTokensApyInfoSelector } from '../../../store/d-apps/d-apps-selectors';
import { setZeroBalancesShown } from '../../../store/settings/settings-actions';
import { useHideZeroBalancesSelector } from '../../../store/settings/settings-selectors';
import {
  useSelectedAccountTezosTokenSelector,
  useVisibleTokensListSelector
} from '../../../store/wallet/wallet-selectors';
import { formatSize, formatSizeScaled } from '../../../styles/format-size';
import { TEZ_TOKEN_SLUG } from '../../../token/data/tokens-metadata';
import { emptyToken, TokenInterface } from '../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { filterTezos } from '../../../utils/filter.util';
import { createGetItemLayout } from '../../../utils/flat-list.utils';
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

export const TokenList: FC = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const styles = useTokenListStyles();

  const { metadata } = useNetworkInfo();
  const apyInfo = useTokensApyInfoSelector();

  const [flatlistHeight, setFlatlistHeight] = useState(0);
  const fakeRefreshControlProps = useFakeRefreshControlProps();

  const tezosToken = useSelectedAccountTezosTokenSelector();
  const visibleTokensList = useVisibleTokensListSelector();
  const isHideZeroBalanceMemo = useHideZeroBalancesSelector();
  const handleHideZeroBalanceChange = useCallback((value: boolean) => {
    dispatch(setZeroBalancesShown(value));
  }, []);
  const { filteredAssetsList, isHideZeroBalance, searchValue, setSearchValue } = useFilteredAssetsList(
    visibleTokensList,
    isHideZeroBalanceMemo
  );
  const isShowTezos = useMemo(
    () => filterTezos(tezosToken.balance, isHideZeroBalance, metadata, searchValue),
    [tezosToken.balance, isHideZeroBalance, searchValue]
  );

  const flatListData = useMemo<FlatListItem[]>(
    () => [...((isShowTezos ? [TEZ_TOKEN_SLUG] : []) as Array<typeof TEZ_TOKEN_SLUG>), ...filteredAssetsList],
    [isShowTezos, filteredAssetsList]
  );

  const screenFillingItemsCount = useMemo(() => flatlistHeight / ITEM_HEIGHT, [flatlistHeight]);

  const renderData = useMemo(
    () => addPlaceholdersForAndroid(flatListData, screenFillingItemsCount),
    [flatListData, screenFillingItemsCount]
  );

  const handleLayout = (event: LayoutChangeEvent) => setFlatlistHeight(event.nativeEvent.layout.height);

  const renderFlatListItem: ListRenderItem<FlatListItem> = useCallback(
    ({ item }) => {
      if (item === TEZ_TOKEN_SLUG) {
        return <TezosToken />;
      }

      if (item.address.startsWith('filler') === true) {
        return <View style={{ height: ITEM_HEIGHT }} />;
      }

      return <TokenListItem token={item} apy={apyInfo[getTokenSlug(item)]?.rate} />;
    },
    [apyInfo]
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
          />
          <Divider size={formatSize(24)} />
          <TouchableIcon
            name={IconNameEnum.Edit}
            size={formatSize(16)}
            onPress={() => navigate(ScreensEnum.ManageAssets)}
          />
        </Search>
      </View>

      <View style={styles.contentContainerStyle} onLayout={handleLayout} testID={TokenListSelectors.TokenList}>
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
