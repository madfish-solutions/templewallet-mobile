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

  return (
    <View
      style={{
        width: size,
        height: size,
        padding: formatSize(4)
      }}
    >
      {isDefined(collectible) && isDefined(collectible.thumbnailUri) && isDefined(collectible.artifactUri) && (
        <Image
          style={styles.image}
          source={{
            uri: isLoadingFailed ? formatImgUri(collectible.thumbnailUri) : formatCollectibleUri(collectible),
            width: size,
            height: size
          }}
          blurRadius={isLoaded ? 0 : 5}
          onError={() => setIsLoadingFailed(true)}
          onLoadEnd={() => setIsLoaded(true)}
        />
      )}
    </View>
  );
};
