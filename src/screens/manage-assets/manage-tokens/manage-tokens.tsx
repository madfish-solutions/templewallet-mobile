import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { useMemo } from 'react';
import { Text } from 'react-native';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { SearchInput } from 'src/components/search-input/search-input';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useTokensListSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { TEMPLE_TOKEN_SLUG } from 'src/token/data/token-slugs';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug, toTokenSlug } from 'src/token/utils/token.utils';

import { ManageAssetsItem } from '../manage-assets-item/manage-assets-item';
import { useManageAssetsStyles } from '../manage-assets.styles';

/** padding + icon size **/
const ITEM_HEIGHT = formatSize(24) * 2;

const keyExtractor = (item: TokenInterface) => getTokenSlug(item);
const renderItem: ListRenderItem<TokenInterface> = ({ item }) => (
  <ManageAssetsItem key={getTokenSlug(item)} asset={item} />
);

const ListEmptyComponent = <DataPlaceholder text="No tokens matching search criteria were found" />;

export const ManageTokens = () => {
  const styles = useManageAssetsStyles();

  const { isTezosNode } = useNetworkInfo();

  const tokensList = useTokensListSelector();
  const tokensWithoutTkey = useMemo(
    () => tokensList.filter(token => toTokenSlug(token.address, token.id) !== TEMPLE_TOKEN_SLUG),
    [tokensList]
  );
  const { filteredAssetsList, setSearchValue } = useFilteredAssetsList(tokensWithoutTkey, false, true);

  return (
    <>
      <SearchInput placeholder="Search assets" onChangeText={setSearchValue} />

      <Text style={styles.descriptionText}>Show{isTezosNode && ', remove'} and hide tokens at your home screen.</Text>

      <FlashList
        data={filteredAssetsList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        estimatedItemSize={ITEM_HEIGHT}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={ListEmptyComponent}
      />
    </>
  );
};
