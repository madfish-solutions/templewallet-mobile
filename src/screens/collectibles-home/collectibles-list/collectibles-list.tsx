import React, { FC, useMemo, useState } from 'react';
import { Dimensions, FlatList, ListRenderItem, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { OrientationType, useOrientationChange } from 'react-native-orientation-locker';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { TokenInterface } from '../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { sliceIntoChunks } from '../../../utils/array.utils';
import { createGetItemLayout } from '../../../utils/flat-list.utils';
import { CollectiblesListStyles } from './collectibles-list.styles';
import { TouchableCollectibleIcon } from './touchable-collectible-icon/touchable-collectible-icon';

interface Props {
  collectiblesList: TokenInterface[];
}

const ITEMS_PER_ROW = 3;

const keyExtractor = (item: TokenInterface[]) => item.map(collectible => getTokenSlug(collectible)).join('/');

export const CollectiblesList: FC<Props> = ({ collectiblesList }) => {
  const windowWidth = Dimensions.get('window').width;
  const ITEM_SIZE = (isTablet() ? windowWidth - 236 : windowWidth - 36) / ITEMS_PER_ROW;
  const [, setOrientation] = useState(OrientationType['FACE-DOWN']);

  const data = useMemo(() => sliceIntoChunks(collectiblesList, ITEMS_PER_ROW), [collectiblesList]);

  // just for recalculation of item size
  useOrientationChange(orientation => (isTablet() ? setOrientation(orientation) : void 0));

  const getItemLayout = createGetItemLayout<TokenInterface[]>(ITEM_SIZE);

  const renderItem: ListRenderItem<TokenInterface[]> = ({ item }) => (
    <View style={CollectiblesListStyles.rowContainer}>
      {item.map(collectible => (
        <TouchableCollectibleIcon key={getTokenSlug(collectible)} collectible={collectible} size={ITEM_SIZE} />
      ))}
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      ListEmptyComponent={<DataPlaceholder text="Not found any NFT" />}
    />
  );
};
