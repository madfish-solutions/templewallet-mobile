import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { memo, useCallback } from 'react';
import { Text, View } from 'react-native';

import { Checkbox } from 'src/components/checkbox/checkbox';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { SearchInput } from 'src/components/search-input/search-input';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { dispatch } from 'src/store';
import { switchIsShowCollectibleInfoAction } from 'src/store/settings/settings-actions';
import { useIsShowCollectibleInfoSelector } from 'src/store/settings/settings-selectors';
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

  const collectiblesList = useCurrentAccountCollectibles();
  const { filteredAssetsList, setSearchValue } = useFilteredAssetsList(collectiblesList);
  const isShowCollectibleInfo = useIsShowCollectibleInfoSelector();

  const handleShowDetailsChange = useCallback(() => void dispatch(switchIsShowCollectibleInfoAction()), []);

  return (
    <>
      <View style={styles.searchRow}>
        <SearchInput placeholder="Search" onChangeText={setSearchValue} containerStyle={styles.searchInputContainer} />
        <Checkbox value={isShowCollectibleInfo} size={16} onChange={handleShowDetailsChange}>
          <Text style={styles.checkboxText}>Show details</Text>
        </Checkbox>
      </View>

      <Text style={styles.descriptionText}>Show, remove, and hide collectibles.</Text>

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
