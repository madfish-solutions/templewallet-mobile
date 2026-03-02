import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { memo } from 'react';
import { Text } from 'react-native';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { SearchInput } from 'src/components/search-input/search-input';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { useCurrentAccountCollectibles } from 'src/utils/assets/hooks';

import { ManageAssetsItem } from '../manage-assets-item/manage-assets-item';
import { useManageAssetsStyles } from '../manage-assets.styles';

const keyExtractor = (item: TokenInterface) => getTokenSlug(item);
const renderItem: ListRenderItem<TokenInterface> = ({ item }) => <ManageAssetsItem asset={item} />;

const ListEmptyComponent = <DataPlaceholder text="No collectibles matching search criteria were found" />;

export const ManageCollectibles = memo(() => {
  const styles = useManageAssetsStyles();

  const { isTezosNode } = useNetworkInfo();

  const collectiblesList = useCurrentAccountCollectibles();
  const { filteredAssetsList, setSearchValue } = useFilteredAssetsList(collectiblesList);

  return (
    <>
      <SearchInput placeholder="Search assets" onChangeText={setSearchValue} />

      <Text style={styles.descriptionText}>Show{isTezosNode && ', remove'} and hide collectibles.</Text>

      <FlashList
        data={filteredAssetsList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={ListEmptyComponent}
      />
    </>
  );
});
