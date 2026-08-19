import { noop } from 'lodash-es';
import React, { FC, useCallback, useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { useColors } from 'src/styles/use-colors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { SLIDE_TO_CONFIRM_BORDER_RADIUS, SLIDE_TO_CONFIRM_THUMB_WIDTH, useSlideToConfirmButtonStyles } from './styles';

const CONFIRM_THRESHOLD = 0.9;

interface Props extends TestIdProps {
  title?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onConfirm: EmptyFn;
}

export const SlideToConfirmButton: FC<Props> = ({
  title = 'Slide to Confirm',
  disabled = false,
  isLoading = false,
  onConfirm,
  testID,
  testIDProperties
}) => {
  const colors = useColors();
  const styles = useSlideToConfirmButtonStyles();
  const { trackEvent } = useAnalytics();
  const [trackWidth, setTrackWidth] = useState(0);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const translateX = useSharedValue(0);
  const maxTranslateX = useSharedValue(0);
  const dragStartX = useSharedValue(0);
  const isConfirmed = useSharedValue(false);

  const handleTrackLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      const width = nativeEvent.layout.width;
      const nextMaxTranslateX = Math.max(width - SLIDE_TO_CONFIRM_THUMB_WIDTH, 0);

      setTrackWidth(width);
      maxTranslateX.value = nextMaxTranslateX;
    },
    [maxTranslateX]
  );

  const handleConfirm = useCallback(() => {
    setHasConfirmed(true);
    trackEvent(testID, AnalyticsEventCategory.ButtonPress, testIDProperties);
    onConfirm();
  }, [onConfirm, testID, testIDProperties, trackEvent]);

  const panGesture = Gesture.Pan()
    .enabled(!disabled && !isLoading && !hasConfirmed && trackWidth > 0)
    .activeOffsetX(8)
    .failOffsetY([-20, 20])
    .onBegin(() => {
      'worklet';
      dragStartX.value = translateX.value;
    })
    .onUpdate(event => {
      'worklet';
      if (isConfirmed.value) {
        return;
      }

      translateX.value = Math.min(Math.max(dragStartX.value + event.translationX, 0), maxTranslateX.value);
    })
    .onEnd(() => {
      'worklet';
      if (isConfirmed.value) {
        return;
      }

      if (maxTranslateX.value > 0 && translateX.value >= maxTranslateX.value * CONFIRM_THRESHOLD) {
        translateX.value = withSpring(maxTranslateX.value);
        isConfirmed.value = true;
        scheduleOnRN(handleConfirm);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const fillStyle = useAnimatedStyle(() => ({
    // Extend under the thumb so its rounded left corners don't reveal the track.
    width: translateX.value + SLIDE_TO_CONFIRM_BORDER_RADIUS
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  if (hasConfirmed || isLoading) {
    return <ButtonLargePrimary title="" isLoading onPress={noop} testID={testID} />;
  }

  return (
    <View style={[styles.track, disabled && styles.disabled]} onLayout={handleTrackLayout} testID={testID}>
      <Animated.View style={[styles.fill, fillStyle]} />
      <Text style={styles.label}>{title}</Text>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.thumb, thumbStyle]}>
          <IconV2 name={IconNameV2Enum.ChevronRight2} size={24} color={colors.white} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
