import FastImage, { Source } from '@d11/react-native-fast-image';
import { noop } from 'lodash-es';
import React, { FC, memo } from 'react';
import { SvgUri } from 'react-native-svg';

import { ImagePromotionView } from 'src/components/image-promotion-view';
import { formatSize } from 'src/styles/format-size';

import { usePromotionCarouselItemStyles } from './promotion-carousel-item.styles';

interface Props {
  testID: string;
  source: Source | string;
  link: string;
  shouldShowAdBage?: boolean;
}

export const PromotionCarouselItem: FC<Props> = memo(({ source, link, testID, shouldShowAdBage = false }) => {
  const styles = usePromotionCarouselItemStyles();

  return (
    <ImagePromotionView
      href={link}
      isVisible
      shouldShowCloseButton={false}
      shouldShowAdBage={shouldShowAdBage}
      testID={testID}
      onClose={noop}
    >
      {typeof source === 'string' ? (
        <SvgUri style={styles.bannerImage} height={formatSize(112)} width={formatSize(343)} uri={source} />
      ) : (
        <FastImage style={styles.bannerImage} source={source} />
      )}
    </ImagePromotionView>
  );
});
