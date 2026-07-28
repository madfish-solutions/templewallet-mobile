import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Text, View } from 'react-native';

import { Checkbox } from 'src/components/checkbox/checkbox';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { SearchInput } from 'src/components/search-input/search-input';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { TEMPLE_TOKEN_SLUG } from 'src/token/data/token-slugs';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { useCurrentAccountTokens } from 'src/utils/assets/hooks';

import { ManageAssetsItem } from '../manage-assets-item/manage-assets-item';
import { useManageAssetsStyles } from '../manage-assets.styles';

const keyExtractor = (item: TokenInterface) => getTokenSlug(item);
const renderItem: ListRenderItem<TokenInterface> = ({ item }) => <ManageAssetsItem asset={item} />;

const ListEmptyComponent = <DataPlaceholder text="No tokens matching search criteria were found" />;

export const ManageTokens = memo(() => {
  const styles = useManageAssetsStyles();

  const tokensList = useCurrentAccountTokens();
  const tokensWithoutTkey = useMemo(() => tokensList.filter(token => token.slug !== TEMPLE_TOKEN_SLUG), [tokensList]);
  const [shouldHideZeroBalanceTokens, setShouldHideZeroBalanceTokens] = useState(false);
  const { filteredAssetsList, setSearchValue } = useFilteredAssetsList(
    tokensWithoutTkey,
    shouldHideZeroBalanceTokens,
    true
  );
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIsScrolled(event.nativeEvent.contentOffset.y > 0);
  }, []);

  return (
    <>
      <View style={styles.searchRow}>
        {isScrolled && <View pointerEvents="none" style={styles.searchRowShadow} />}
        <SearchInput placeholder="Search" onChangeText={setSearchValue} containerStyle={styles.searchInputContainer} />
        <Checkbox value={shouldHideZeroBalanceTokens} size={16} onChange={setShouldHideZeroBalanceTokens}>
          <Text style={styles.checkboxText}>Hide 0 balance</Text>
        </Checkbox>
      </View>

      <FlashList
        data={filteredAssetsList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={ListEmptyComponent}
        onScroll={handleScroll}
      />
    </>
  );
});
