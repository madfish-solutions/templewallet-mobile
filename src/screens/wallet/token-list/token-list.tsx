import React, { FC, useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Checkbox } from '../../../components/checkbox/checkbox';
import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { Divider } from '../../../components/divider/divider';
import { useFilteredAssetsList } from '../../../hooks/use-filtered-assets-list.hook';
import { setZeroBalancesShown } from '../../../store/settings/settings-actions';
import { useHideZeroBalances } from '../../../store/settings/settings-selectors';
import {
  useSelectedAccountTezosTokenSelector,
  useVisibleTokensListSelector
} from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { TEZ_TOKEN_SLUG } from '../../../token/data/tokens-metadata';
import { TokenInterface } from '../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { filterTezos } from '../../../utils/filter.util';
import { SearchContainer } from './search-container/search-container';
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

const renderFlatListItem: ListRenderItem<FlatListItem> = ({ item }) => {
  if (item === TEZ_TOKEN_SLUG) {
    return <TezosToken />;
  }

  return <TokenListItem token={item} />;
};

export const TokenList: FC = () => {
  const dispatch = useDispatch();
  const styles = useTokenListStyles();

  const tezosToken = useSelectedAccountTezosTokenSelector();
  const visibleTokensList = useVisibleTokensListSelector();
  const isHideZeroBalanceMemo = useHideZeroBalances();
  const handleHideZeroBalanceChange = useCallback((value: boolean) => {
    dispatch(setZeroBalancesShown(value));
  }, []);
  const { filteredAssetsList, isHideZeroBalance, searchValue, setSearchValue } = useFilteredAssetsList(
    visibleTokensList,
    isHideZeroBalanceMemo
  );
  const isShowTezos = useMemo(
    () => filterTezos(tezosToken.balance, isHideZeroBalance, searchValue),
    [tezosToken.balance, isHideZeroBalance, searchValue]
  );

  const flatListData = useMemo<FlatListItem[]>(
    () => [...((isShowTezos ? [TEZ_TOKEN_SLUG] : []) as Array<typeof TEZ_TOKEN_SLUG>), ...filteredAssetsList],
    [isShowTezos, filteredAssetsList]
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

        <SearchContainer onChange={setSearchValue} />
      </View>

      <View style={styles.contentContainerStyle} testID={TokenListSelectors.TokenList}>
        <FlatList
          data={flatListData}
          renderItem={renderFlatListItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={<DataPlaceholder text="No records found." />}
          windowSize={5}
          updateCellsBatchingPeriod={100}
          removeClippedSubviews={true}
        />
      </View>
    </>
  );
};
