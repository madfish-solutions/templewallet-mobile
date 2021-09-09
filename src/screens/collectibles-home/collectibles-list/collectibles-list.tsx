import React, { FC } from 'react';
import { View } from 'react-native';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { useLayoutSizes } from '../../../hooks/use-layout-sizes.hook';
import { TokenInterface } from '../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { CollectiblesListStyles } from './collectibles-list.styles';
import { TouchableCollectibleIcon } from './touchable-collectible-icon/touchable-collectible-icon';

interface Props {
  collectiblesList: TokenInterface[];
}

export const CollectiblesList: FC<Props> = ({ collectiblesList }) => {
  const { layoutWidth, handleLayout } = useLayoutSizes();

  const smallCardSize = (1 / 3) * layoutWidth - 0.1;
  const bigCardSize = (2 / 3) * layoutWidth - 0.1;

  const [first, second, third, ...rest] = collectiblesList;

  return collectiblesList.length === 0 ? (
    <DataPlaceholder text="Not found any NFT" />
  ) : (
    <>
      <View style={CollectiblesListStyles.rowContainer} onLayout={handleLayout}>
        <TouchableCollectibleIcon collectible={first} size={bigCardSize} />
        <View>
          <TouchableCollectibleIcon collectible={second} size={smallCardSize} />
          <TouchableCollectibleIcon collectible={third} size={smallCardSize} />
        </View>
      </View>
      <View style={CollectiblesListStyles.rowContainer}>
        {rest.map(collectible => (
          <TouchableCollectibleIcon key={getTokenSlug(collectible)} collectible={collectible} size={smallCardSize} />
        ))}
      </View>
    </>
  );
};
