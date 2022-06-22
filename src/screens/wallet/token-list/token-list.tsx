import React, { FC, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';

import { Checkbox } from '../../../components/checkbox/checkbox';
import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { Divider } from '../../../components/divider/divider';
import { QUIPU_SLUG } from '../../../config/tokens';
import { useFilteredAssetsListMemo } from '../../../hooks/use-filtered-assets-list.hook';
import { useSortedAssetsList } from '../../../hooks/use-sorted-assets-list.hook';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
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
import { QuipuToken } from './token-list-item/quipu-token';
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

export const TokenList: FC = () => {
  const styles = useTokenListStyles();
  const { navigate } = useNavigation();

  const tezosToken = useSelectedAccountTezosTokenSelector();
  const visibleTokensList = useVisibleTokensListSelector();
  const { filteredAssetsList, isHideZeroBalance, setIsHideZeroBalance, searchValue, setSearchValue } =
    useFilteredAssetsListMemo(visibleTokensList);
  const sortedAssetsList = useSortedAssetsList(filteredAssetsList);

  const isShowTezos = useMemo(
    () => filterTezos(tezosToken.balance, isHideZeroBalance, searchValue),
    [tezosToken.balance, isHideZeroBalance, searchValue]
  );

  const flatListData = useMemo<FlatListItem[]>(
    () => [...((isShowTezos ? [TEZ_TOKEN_SLUG] : []) as Array<typeof TEZ_TOKEN_SLUG>), ...sortedAssetsList],
    [isShowTezos, sortedAssetsList]
  );
  const renderFlatListItem: ListRenderItem<FlatListItem> = useCallback(
    ({ item }) => {
      if (item === TEZ_TOKEN_SLUG) {
        return <TezosToken />;
      }

      const slug = getTokenSlug(item);

      if (slug === QUIPU_SLUG) {
        return <QuipuToken token={item} />;
      }

      return <TokenListItem token={item} onPress={() => navigate(ScreensEnum.TokenScreen, { token: item })} />;
    },
    [navigate]
  );

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.hideZeroBalanceContainer}>
          <Checkbox
            value={isHideZeroBalance}
            size={formatSize(16)}
            strokeWidth={formatSize(2)}
            onChange={setIsHideZeroBalance}
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
        />
      </View>
    </>
  );
};
