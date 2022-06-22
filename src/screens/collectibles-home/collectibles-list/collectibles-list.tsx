import React, { FC, useMemo } from 'react';
import { View } from 'react-native';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { useLayoutSizes } from '../../../hooks/use-layout-sizes.hook';
import { formatSize } from '../../../styles/format-size';
import { TokenInterface } from '../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { CollectiblesListStyles } from './collectibles-list.styles';
import { TouchableCollectibleIcon } from './touchable-collectible-icon/touchable-collectible-icon';

interface Props {
  collectiblesList: TokenInterface[];
}

export const CollectiblesList: FC<Props> = ({ collectiblesList }) => {
  const { layoutWidth, handleLayout } = useLayoutSizes();

  const smallCardSize = useMemo(() => (1 / 3) * layoutWidth - formatSize(0.5), [layoutWidth]);

  return collectiblesList.length === 0 ? (
    <DataPlaceholder text="Not found any NFT" />
  ) : (
    <View style={CollectiblesListStyles.rowContainer} onLayout={handleLayout}>
      {collectiblesList.map(collectible => (
        <TouchableCollectibleIcon key={getTokenSlug(collectible)} collectible={collectible} size={smallCardSize} />
      ))}
    </View>
  );
};
