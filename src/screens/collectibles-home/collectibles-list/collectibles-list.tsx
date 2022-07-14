import React, { FC, useMemo } from 'react';
import { Dimensions, FlatList, ListRenderItem, View } from 'react-native';

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

const windowWidth = Dimensions.get('window').width;
const ITEM_SIZE = (windowWidth - 36) / ITEMS_PER_ROW;

const renderItem: ListRenderItem<TokenInterface[]> = ({ item }) => (
  <View style={CollectiblesListStyles.rowContainer}>
    {item.map(collectible => (
      <TouchableCollectibleIcon key={getTokenSlug(collectible)} collectible={collectible} size={ITEM_SIZE} />
    ))}
  </View>
);

const keyExtractor = (item: TokenInterface[]) => item.map(collectible => getTokenSlug(collectible)).join('/');

const getItemLayout = createGetItemLayout<TokenInterface[]>(ITEM_SIZE);

export const CollectiblesList: FC<Props> = ({ collectiblesList }) => {
  const data = useMemo(() => sliceIntoChunks(collectiblesList, ITEMS_PER_ROW), [collectiblesList]);

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
