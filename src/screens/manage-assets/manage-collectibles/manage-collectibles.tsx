import React from 'react';
import { Text } from 'react-native';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { Divider } from '../../../components/divider/divider';
import { IconTitleNoBg } from '../../../components/icon-title-no-bg/icon-title-no-bg';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { SearchInput } from '../../../components/search-input/search-input';
import { useFilteredAssetsList } from '../../../hooks/use-filtered-assets-list.hook';
import { ModalsEnum } from '../../../navigator/enums/modals.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { useCollectiblesListSelector, } from '../../../store/wallet/wallet-selectors';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { ManageAssetsItem } from '../manage-assets-item/manage-assets-item';
import { useManageAssetsStyles } from '../manage-assets.styles';

export const ManageCollectibles = () => {
  const styles = useManageAssetsStyles();
  const { navigate } = useNavigation();

  const collectiblesList = useCollectiblesListSelector();
  const { filteredAssetsList, setSearchValue } = useFilteredAssetsList(collectiblesList);

  return (
    <>
      <SearchInput placeholder="Search by address" onChangeText={setSearchValue} />
      <Text style={styles.descriptionText}>Show, remove and hide collectibles.</Text>

      <ScreenContainer contentContainerStyle={styles.contentContainerStyle}>
        {filteredAssetsList.length === 0 ? (
          <DataPlaceholder text="No collectibles matching search criteria were found" />
        ) : (
          filteredAssetsList.map(collectible => (
            <ManageAssetsItem key={getTokenSlug(collectible)} asset={collectible} />
          ))
        )}

        <Divider />
        <IconTitleNoBg
          icon={IconNameEnum.PlusCircle}
          text="ADD COLLECTIBLE"
          onPress={() => navigate(ModalsEnum.AddToken)}
        />
        <Divider />
      </ScreenContainer>
    </>
  );
};
