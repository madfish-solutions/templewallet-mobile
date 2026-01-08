import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Animated, Text, useWindowDimensions, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';

import KoloLogo from './assets/kolo-logo.svg';
import { KoloCardSelectors } from './kolo-card.selectors';
import {
  CARD_BORDER_RADIUS,
  CARD_HEIGHT,
  CARD_MARGIN_HORIZONTAL,
  useKoloCryptoCardPreviewStyles
} from './kolo-crypto-card-preview.styles';

interface KoloCryptoCardPreviewProps extends TestIdProps {
  onPress?: EmptyFn;
  shouldAnimate?: boolean;
  onAnimationComplete?: EmptyFn;
}

export const KoloCryptoCardPreview: FC<KoloCryptoCardPreviewProps> = ({
  onPress,
  shouldAnimate = true,
  onAnimationComplete
}) => {
  const styles = useKoloCryptoCardPreviewStyles();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - CARD_MARGIN_HORIZONTAL * 2;

  const translateY = useRef(new Animated.Value(0)).current;
  const rotateZ = useRef(new Animated.Value(0)).current;

  const playAnimation = useCallback(() => {
    translateY.setValue(0);
    rotateZ.setValue(0);

    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -formatSize(8),
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(rotateZ, {
          toValue: -2,
          duration: 400,
          useNativeDriver: true
        })
      ]),
      Animated.delay(700),
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true
        }),
        Animated.spring(rotateZ, {
          toValue: 0,
          useNativeDriver: true
        })
      ])
    ]).start(() => {
      onAnimationComplete?.();
    });
  }, [translateY, rotateZ, onAnimationComplete]);

  useEffect(() => {
    if (shouldAnimate) {
      playAnimation();
    }
  }, [shouldAnimate, playAnimation]);

  const animatedStyle = {
    transform: [
      { translateY },
      {
        rotate: rotateZ.interpolate({
          inputRange: [-2, 0],
          outputRange: ['-2deg', '0deg']
        })
      }
    ]
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        testID={KoloCardSelectors.cryptoCardButton}
        style={styles.container}
      >
        <Svg width={cardWidth} height={CARD_HEIGHT} style={styles.svgStyles}>
          <Defs>
            <LinearGradient id="koloGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FF5B00" />
              <Stop offset="100%" stopColor="#F4BE38" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width={cardWidth} height={CARD_HEIGHT} rx={CARD_BORDER_RADIUS} fill="url(#koloGradient)" />
        </Svg>

        <View>
          <Text style={styles.title}>Crypto card</Text>
        </View>

        <View>
          <KoloLogo width={formatSize(44)} height={formatSize(16)} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
