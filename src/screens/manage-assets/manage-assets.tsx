import React from 'react';
import { Text } from 'react-native';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { SearchInput } from '../../components/search-input/search-input';
import { useFilteredTokenList } from '../../hooks/use-filtered-token-list.hook';
import { ManageAssetsItem } from './manage-assets-item/manage-assets-item';

export const ManageAssets = () => {
  const { filteredTokensList, setSearchValue } = useFilteredTokenList();

  return (
    <ScreenContainer>
      <SearchInput onChangeText={setSearchValue} />

      <Text>Show, remove and hide tokens at your home screen.</Text>

      {filteredTokensList.map(token => (
        <ManageAssetsItem key={token.address} token={token} />
      ))}
    </ScreenContainer>
  );
};
