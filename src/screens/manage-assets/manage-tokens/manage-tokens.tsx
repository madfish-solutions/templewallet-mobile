import React from 'react';
import { Text } from 'react-native';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { SearchInput } from '../../../components/search-input/search-input';
import { useFilteredAssetsList } from '../../../hooks/use-filtered-assets-list.hook';
import { useNetworkInfo } from '../../../hooks/use-network-info.hook';
import { useTokensListSelector } from '../../../store/wallet/wallet-selectors';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { ManageAssetsItem } from '../manage-assets-item/manage-assets-item';
import { useManageAssetsStyles } from '../manage-assets.styles';

export const ManageTokens = () => {
  const styles = useManageAssetsStyles();

  const { isTezosNode } = useNetworkInfo();

  const tokensList = useTokensListSelector();
  const { filteredAssetsList, setSearchValue } = useFilteredAssetsList(tokensList);

  return (
    <>
      <SearchInput placeholder="Search assets" onChangeText={setSearchValue} />
      <Text style={styles.descriptionText}>Show{isTezosNode && ', remove'} and hide tokens at your home screen.</Text>

      <ScreenContainer contentContainerStyle={styles.contentContainerStyle}>
        {filteredAssetsList.length === 0 ? (
          <DataPlaceholder text="No tokens matching search criteria were found" />
        ) : (
          filteredAssetsList.map(token => <ManageAssetsItem key={getTokenSlug(token)} asset={token} />)
        )}
      </ScreenContainer>
    </>
  );
};
