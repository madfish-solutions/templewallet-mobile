import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';

import { CollectibleIconSize } from 'src/components/collectible-icon/collectible-icon.props';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { useCollectibleHistoryIconStyles } from 'src/screens/text-to-nft/components/collectible-image/collectible-image.styles';
import { formatSize } from 'src/styles/format-size';
import { getBrokenImageSize } from 'src/utils/get-broken-image-size';

interface Props {
  uri: string;
  size: number;
  iconSizeType?: CollectibleIconSize;
  style?: StyleProp<ViewStyle>;
}

export const CollectibleImage: FC<Props> = ({ size, uri, iconSizeType = CollectibleIconSize.SMALL, style }) => {
  const styles = useCollectibleHistoryIconStyles();

  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isLoadingError, setIsLoadingError] = useState(false);

  const handleLoadEnd = useCallback(() => setIsImageLoading(false), []);

  const handleError = useCallback(() => {
    setIsLoadingError(true);
    setIsImageLoading(false);
  }, []);

  useEffect(() => {
    setIsLoadingError(false);
  }, [uri]);

  const isBigIcon = iconSizeType === CollectibleIconSize.BIG;

  const collectibleImage = useMemo(() => {
    if (isLoadingError) {
      const brokenImageSize = getBrokenImageSize(isBigIcon);

      return (
        <View style={styles.image}>
          <Icon
            name={IconNameEnum.BrokenImage}
            width={formatSize(brokenImageSize.width)}
            height={formatSize(brokenImageSize.height)}
          />
        </View>
      );
    }

    return (
      <FastImage
        style={[styles.image, { height: size, width: size }]}
        source={{ uri }}
        resizeMode="contain"
        onError={handleError}
        onLoadEnd={handleLoadEnd}
      />
    );
  }, [isLoadingError, isBigIcon, uri]);

  return (
    <View
      style={[
        styles.root,
        {
          width: size,
          height: size
        },
        style
      ]}
    >
      {collectibleImage}

      {isImageLoading && <ActivityIndicator size={isBigIcon ? 'large' : 'small'} style={styles.loader} />}
    </View>
  );
};
