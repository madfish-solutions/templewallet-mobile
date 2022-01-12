import React, { FC, useState } from 'react';
import { Image, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { formatCollectibleUri, formatImgUri } from '../../utils/image.utils';
import { isDefined } from '../../utils/is-defined';
import { CollectibleIconProps } from './collectible-icon.props';
import { useCollectibleIconStyles } from './collectible-icon.styles';

export const CollectibleIcon: FC<CollectibleIconProps> = ({ collectible, size }) => {
  const styles = useCollectibleIconStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [fallback, setFallback] = useState(false);

  let thumbnailUri;
  if (isDefined(collectible) && isDefined(collectible.thumbnailUri)) {
    thumbnailUri = fallback ? formatImgUri(collectible.thumbnailUri) : formatCollectibleUri(collectible);
  }

  return isDefined(collectible) ? (
    <View
      style={{
        width: size,
        height: size,
        padding: formatSize(4)
      }}
    >
      {isDefined(collectible.artifactUri) ? (
        <Image
          style={styles.image}
          source={{
            uri: thumbnailUri,
            width: size,
            height: size
          }}
          blurRadius={isLoaded ? 0 : 5}
          onError={() => setFallback(true)}
          onLoadEnd={() => setIsLoaded(true)}
        />
      ) : null}
    </View>
  ) : null;
};
