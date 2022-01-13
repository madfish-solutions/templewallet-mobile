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
  const [isLoadingFailed, setIsLoadingFailed] = useState(false);

  let uri;
  if (isDefined(collectible) && isDefined(collectible.thumbnailUri)) {
    uri = isLoadingFailed ? formatImgUri(collectible.thumbnailUri) : formatCollectibleUri(collectible);
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
            uri,
            width: size,
            height: size
          }}
          blurRadius={isLoaded ? 0 : 5}
          onError={() => setIsLoadingFailed(true)}
          onLoadEnd={() => setIsLoaded(true)}
        />
      ) : null}
    </View>
  ) : null;
};
