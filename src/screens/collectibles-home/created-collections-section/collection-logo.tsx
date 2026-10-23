import FastImage from '@d11/react-native-fast-image';
import React, { memo } from 'react';
import { View } from 'react-native';

import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { useCollectionLogoImagesStack } from 'src/hooks/use-images-stack';
import { Collection } from 'src/store/collectons/collections-state';
import { useColors } from 'src/styles/use-colors';

import { useCollectionButtonStyles } from '../styles';

interface Props {
  logo: Collection['logo'];
}

export const CollectionLogo = memo<Props>(({ logo }) => {
  const styles = useCollectionButtonStyles();
  const { gray3 } = useColors();
  const { src, isStackFailed, onSuccess, onFail } = useCollectionLogoImagesStack(logo);

  if (isStackFailed || src == null) {
    return (
      <View testID="collection-logo-fallback" style={[styles.logo, styles.image, styles.brokenImage]}>
        <IconV2 name={IconNameV2Enum.NftCollection} size={32} color={gray3} />
      </View>
    );
  }

  return (
    <FastImage
      key={src}
      testID="collection-logo-image"
      source={{ uri: src }}
      style={[styles.logo, styles.image]}
      onLoad={onSuccess}
      onError={onFail}
    />
  );
});
