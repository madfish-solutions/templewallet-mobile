import React from 'react';
import { Text } from 'react-native';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { SearchInput } from 'src/components/search-input/search-input';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { useCurrentAccountCollectibles } from 'src/utils/assets/hooks';

import { ManageAssetsItem } from '../manage-assets-item/manage-assets-item';
import { useManageAssetsStyles } from '../manage-assets.styles';

export const ManageCollectibles = () => {
  const styles = useManageAssetsStyles();

  const { isTezosNode } = useNetworkInfo();

  const collectiblesList = useCurrentAccountCollectibles();
  const { filteredAssetsList, setSearchValue } = useFilteredAssetsList(collectiblesList);

  return (
    <>
      <SearchInput placeholder="Search assets" onChangeText={setSearchValue} />

      <Text style={styles.descriptionText}>Show{isTezosNode && ', remove'} and hide collectibles.</Text>

      <ScreenContainer contentContainerStyle={styles.contentContainerStyle}>
        {filteredAssetsList.length === 0 ? (
          <DataPlaceholder text="No collectibles matching search criteria were found" />
        ) : (
          filteredAssetsList.map(collectible => (
            <ManageAssetsItem key={getTokenSlug(collectible)} asset={collectible} />
          ))
        )}
      </ScreenContainer>
    </>
  );
};
