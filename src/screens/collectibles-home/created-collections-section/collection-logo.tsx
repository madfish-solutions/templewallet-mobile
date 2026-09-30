import FastImage from '@d11/react-native-fast-image';
import React, { memo, useState } from 'react';
import { View } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { Collection } from 'src/store/collectons/collections-state';
import { formatSize } from 'src/styles/format-size';
import { formatObjktLogoUri } from 'src/utils/image.utils';

import { useCollectionButtonStyles } from '../styles';

interface Props {
  logo: Collection['logo'];
}

export const CollectionLogo = memo<Props>(({ logo }) => {
  const styles = useCollectionButtonStyles();
  const uri = formatObjktLogoUri(logo);
  const [failedUri, setFailedUri] = useState<string>();

  if (!uri || failedUri === uri) {
    return (
      <View testID="collection-logo-fallback" style={[styles.logo, styles.image, styles.brokenImage]}>
        <Icon name={IconNameEnum.NFTCollection} size={formatSize(31)} />
      </View>
    );
  }

  return (
    <FastImage
      key={uri}
      testID="collection-logo-image"
      source={{ uri }}
      style={[styles.logo, styles.image]}
      onError={() => setFailedUri(uri)}
    />
  );
});
