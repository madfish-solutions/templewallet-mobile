import React, { memo, useRef } from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { AnimatedStyle } from 'react-native-reanimated';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ImageWithIndicator } from 'src/components/image';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { Collection } from 'src/store/collectons/collections-state';
import { formatSize } from 'src/styles/format-size';
import { useDidUpdate } from 'src/utils/hooks';
import { formatObjktLogoUri } from 'src/utils/image.utils';

import { useCollectiblesHomeStyles, useCollectionButtonStyles } from '../styles';

interface Props {
  accountId: string;
  animatedStyle: AnimatedStyle<ViewStyle>;
  collections: Collection[];
  onLayout: (event: LayoutChangeEvent) => void;
}

const keyExtractor = ({ type, contract, galleryPk }: Collection): string => `${type}/${contract}/${galleryPk}`;
const renderItem: ListRenderItem<Collection> = ({ item }) => <CollectionButton item={item} />;

export const CreatedCollectionsSection = memo<Props>(({ accountId, animatedStyle, collections, onLayout }) => {
  const styles = useCollectiblesHomeStyles();
  const listRef = useRef<FlatList<Collection>>(null);

  // On collections number decrease scroll might not reposition & items remain off-view
  useDidUpdate(() => void listRef.current?.scrollToOffset({ offset: 0 }), [accountId]);

  if (collections.length === 0) {
    return null;
  }

  return (
    <Animated.View style={[styles.collectionsSection, animatedStyle]}>
      <View onLayout={onLayout}>
        <View style={styles.collectionsHeader}>
          <Text style={styles.collectionsLabel}>Created collections</Text>
        </View>

        <FlatList
          ref={listRef}
          data={collections}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.collectionsList}
        />
      </View>
    </Animated.View>
  );
});

interface CollectionButtonProps {
  item: Collection;
}

const CollectionButton = memo<CollectionButtonProps>(({ item }) => {
  const navigateToScreen = useNavigateToScreen();
  const styles = useCollectionButtonStyles();

  const handlePress = () =>
    navigateToScreen({
      screen: ScreensEnum.Collection,
      params: {
        collectionContract: item.contract,
        collectionName: item.name,
        type: item.type,
        galleryPk: item.galleryPk
      }
    });

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <ImageWithIndicator
        source={{ uri: formatObjktLogoUri(item.logo) }}
        style={styles.logo}
        imageStyle={styles.image}
        indicator={ActivityIndicator}
        renderError={() => (
          <View style={[styles.image, styles.brokenImage]}>
            <Icon name={IconNameEnum.NFTCollection} size={formatSize(31)} />
          </View>
        )}
      />

      <Text numberOfLines={1} style={styles.title}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
});
