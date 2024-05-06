import { BlurView } from '@react-native-community/blur';
import React, { useCallback, memo, PropsWithChildren, useState, useMemo } from 'react';
import { LayoutChangeEvent, View } from 'react-native';

import { Bage } from 'src/components/bage/bage';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { isDefined } from 'src/utils/is-defined';
import { openUrl } from 'src/utils/linking';

import { SimplePlayer } from '../simple-player';
import { UnknownTypeImage } from '../unknown-type-image';

import { PromotionItemSelectors } from './selectors';
import { useImagePromotionViewStyles } from './styles';

export interface BackgroundAsset {
  type: 'image' | 'video';
  uri: string;
  width: number;
  height: number;
}

interface ImagePromotionViewProps extends TestIdProps {
  href: string;
  isVisible: boolean;
  shouldShowCloseButton: boolean;
  shouldShowAdBage: boolean;
  backgroundAsset?: BackgroundAsset;
  onClose: EmptyFn;
}

export const ImagePromotionView = memo<PropsWithChildren<ImagePromotionViewProps>>(
  ({
    children,
    href,
    isVisible,
    shouldShowCloseButton,
    shouldShowAdBage,
    backgroundAsset,
    onClose,
    ...testIDProps
  }) => {
    const colors = useColors();
    const styles = useImagePromotionViewStyles();
    const [layoutSize, setLayoutSize] = useState<{ width: number; height: number }>();

    const openLink = useCallback(() => href && openUrl(href), [href]);
    const handleLayout = useCallback((event: LayoutChangeEvent) => {
      event.persist();
      const { width, height } = event.nativeEvent.layout;
      setLayoutSize({ width, height });
    }, []);

    const backgroundSize = useMemo(() => {
      if (!backgroundAsset) {
        return undefined;
      }

      if (!layoutSize) {
        return { width: backgroundAsset.width, height: backgroundAsset.height };
      }

      const { width, height } = layoutSize;

      if (backgroundAsset.height === 0) {
        return { width, height: 0 };
      }

      const aspectRatio = backgroundAsset.width / backgroundAsset.height;
      const layoutAspectRatio = width / height;

      if (aspectRatio === 0) {
        return { width: 0, height };
      }

      if (aspectRatio < layoutAspectRatio) {
        return { width, height: width / aspectRatio };
      }

      return { width: height * aspectRatio, height };
    }, [backgroundAsset, layoutSize]);

    return (
      <TouchableWithAnalytics
        {...testIDProps}
        style={[styles.container, !isVisible && styles.invisible]}
        onPress={openLink}
        onLayout={handleLayout}
      >
        {isDefined(backgroundAsset) && (
          <>
            <View style={styles.centeredWithOverflowWrapper}>
              {backgroundAsset.type === 'image' ? (
                <UnknownTypeImage
                  width={backgroundSize?.width ?? backgroundAsset.width}
                  height={backgroundSize?.height ?? backgroundAsset.height}
                  uri={backgroundAsset.uri}
                />
              ) : (
                <SimplePlayer
                  uri={backgroundAsset.uri}
                  width={backgroundSize?.width ?? backgroundAsset.width}
                  height={backgroundSize?.height ?? backgroundAsset.height}
                  isVideo
                  shouldShowLoader={false}
                />
              )}
            </View>
            <BlurView style={styles.blurView} blurType="light" blurAmount={10} />
          </>
        )}

        {children}

        {shouldShowAdBage && (
          <View style={styles.bageContainer}>
            <Bage text="AD" />
          </View>
        )}

        {shouldShowCloseButton && (
          <TouchableWithAnalytics
            style={styles.closeButton}
            onPress={onClose}
            testID={PromotionItemSelectors.closeButton}
          >
            <Icon name={IconNameEnum.XBold} size={formatSize(9.43)} color={colors.peach} />
          </TouchableWithAnalytics>
        )}
      </TouchableWithAnalytics>
    );
  }
);
