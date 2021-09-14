import React, { FC } from 'react';
import { Dimensions, Image, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { formatImgUri } from '../../utils/image.utils';
import { isDefined } from '../../utils/is-defined';
import { CollectibleIconProps } from './collectible-icon.props';
import { CollectibleIconStyles } from './collectible-icon.styles';

export const CollectibleIcon: FC<CollectibleIconProps> = ({ collectible, size }) => {
  const colors = useColors();
  const scale = Dimensions.get('screen').width / Dimensions.get('screen').width;

  return isDefined(collectible) ? (
    <View
      style={{
        width: size,
        height: size,
        padding: formatSize(4)
      }}>
      {isDefined(collectible.artifactUri) ? (
        <Image
          style={[
            CollectibleIconStyles.image,
            {
              backgroundColor: colors.blue10,
              borderRadius: formatSize(8 * scale)
            }
          ]}
          source={{ uri: formatImgUri(collectible.artifactUri), width: size, height: size }}
        />
      ) : null}
    </View>
  ) : null;
};
