import React from 'react';
import { Text } from 'react-native';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { Divider } from '../../components/divider/divider';
import { PlusCircleButton } from '../../components/plus-circle-button/plus-circle-button';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { SearchInput } from '../../components/search-input/search-input';
import { useFilteredTokenList } from '../../hooks/use-filtered-token-list.hook';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useTokensListSelector } from '../../store/wallet/wallet-selectors';
import { tokenMetadataSlug } from '../../token/utils/token.utils';
import { ManageAssetsItem } from './manage-assets-item/manage-assets-item';
import { useManageAssetsStyles } from './manage-assets.styles';

export const ManageAssets = () => {
  const styles = useManageAssetsStyles();
  const { navigate } = useNavigation();

  const tokensList = useTokensListSelector();
  const { filteredTokensList, setSearchValue } = useFilteredTokenList(tokensList);

  return (
    <>
      <SearchInput placeholder="Search by address" onChangeText={setSearchValue} />
      <ScreenContainer contentContainerStyle={styles.contentContainerStyle}>
        <Text style={styles.descriptionText}>Show, remove and hide tokens at your home screen.</Text>

        {filteredTokensList.length === 0 ? (
          <DataPlaceholder text="No tokens matching search criteria were found" />
        ) : (
          filteredTokensList.map(token => <ManageAssetsItem key={tokenMetadataSlug(token)} token={token} />)
        )}

        <Divider />
        <PlusCircleButton text="ADD TOKEN" onPress={() => navigate(ModalsEnum.AddToken)} />
        <Divider />
      </ScreenContainer>
    </>
  );
};
