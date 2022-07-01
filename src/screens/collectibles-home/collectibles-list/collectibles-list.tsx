import React, { FC } from 'react';
import { Dimensions, View } from 'react-native';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { TokenInterface } from '../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { CollectiblesListStyles } from './collectibles-list.styles';
import { TouchableCollectibleIcon } from './touchable-collectible-icon/touchable-collectible-icon';

interface Props {
  collectiblesList: TokenInterface[];
}

export const CollectiblesList: FC<Props> = ({ collectiblesList }) => {
  const { width } = Dimensions.get('window');
  const itemWidth = (width - 36) / 3;

  return collectiblesList.length === 0 ? (
    <DataPlaceholder text="Not found any NFT" />
  ) : (
    <View style={CollectiblesListStyles.rowContainer}>
      {collectiblesList.map(collectible => (
        <TouchableCollectibleIcon key={getTokenSlug(collectible)} collectible={collectible} size={itemWidth} />
      ))}
    </View>
  );
};
