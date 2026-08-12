import { useCallback, useEffect } from 'react';
import { LayoutChangeEvent, ViewStyle } from 'react-native';
import {
  AnimatedStyle,
  ScrollHandlerProcessed,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';

const COLLECTIONS_SCROLL_RATIO = 2;

interface CollapsibleCollectionsSection {
  animatedStyle: AnimatedStyle<ViewStyle>;
  onLayout: (event: LayoutChangeEvent) => void;
  onScroll: ScrollHandlerProcessed;
}

export const useCollapsibleCollectionsSection = (resetKey: string): CollapsibleCollectionsSection => {
  const visibility = useSharedValue(1);
  const sectionHeight = useSharedValue(0);

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    height: sectionHeight.value === 0 ? undefined : sectionHeight.value * visibility.value,
    opacity: visibility.value
  }));

  const onScroll = useAnimatedScrollHandler(event => {
    if (sectionHeight.value <= 0) {
      return;
    }

    const scrollOffset = Math.max(0, event.contentOffset.y);
    const collapsedHeight = Math.min(sectionHeight.value, scrollOffset / COLLECTIONS_SCROLL_RATIO);

    visibility.value = 1 - collapsedHeight / sectionHeight.value;
  });

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;

      // Keep the natural height because the animated parent constrains later layout measurements.
      sectionHeight.value = Math.max(sectionHeight.value, height);
    },
    [sectionHeight]
  );

  useEffect(() => {
    visibility.value = 1;
  }, [resetKey, visibility]);

  return { animatedStyle, onLayout, onScroll };
};
