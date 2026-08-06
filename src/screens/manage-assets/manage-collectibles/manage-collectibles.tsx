import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { memo, useCallback, useMemo } from 'react';
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
import {
  EvmManageAsset,
  isEvmCollectibleManageAsset,
  useCurrentAccountCollectibles,
  useCurrentAccountEvmManageAssets
} from 'src/utils/assets/hooks';

import { ManageAssetsItem } from '../manage-assets-item/manage-assets-item';
import { useManageAssetsStyles } from '../manage-assets.styles';

type ManageCollectible = TokenInterface | EvmManageAsset;

const isEvmManageAsset = (asset: ManageCollectible): asset is EvmManageAsset => 'isVisible' in asset;
const keyExtractor = (item: ManageCollectible) => (isEvmManageAsset(item) ? item.assetKey : getTokenSlug(item));
const renderItem: ListRenderItem<ManageCollectible> = ({ item }) => <ManageAssetsItem asset={item} />;

const ListEmptyComponent = <DataPlaceholder text="No collectibles matching search criteria were found" />;

export const ManageCollectibles = memo(() => {
  const styles = useManageAssetsStyles();

  const collectiblesList = useCurrentAccountCollectibles();
  const evmAssets = useCurrentAccountEvmManageAssets();
  const collectibles = useMemo<ManageCollectible[]>(
    () => [...collectiblesList, ...evmAssets.filter(isEvmCollectibleManageAsset)],
    [collectiblesList, evmAssets]
  );
  const { filteredAssetsList, setSearchValue } = useFilteredAssetsList(collectibles);
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
