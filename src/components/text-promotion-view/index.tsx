import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { openUrl } from 'src/utils/linking';

import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableWithAnalytics } from '../touchable-with-analytics';

import { TextPromotionItemSelectors } from './selectors';
import { useTextPromotionViewStyles } from './styles';

interface TextPromotionViewProps extends TestIdProps {
  href: string;
  isVisible: boolean;
  imageSrc: string;
  headline: string;
  contentText?: string;
  shouldShowCloseButton: boolean;
  onImageError: EmptyFn;
  onClose: EmptyFn;
  onReady: EmptyFn;
}

export const TextPromotionView = memo<TextPromotionViewProps>(
  ({
    href,
    isVisible,
    imageSrc,
    headline,
    contentText,
    shouldShowCloseButton,
    onImageError,
    onClose,
    onReady,
    ...testIDProps
  }) => {
    const styles = useTextPromotionViewStyles();
    const colors = useColors();
    const headlineRef = useRef<View>(null);
    const headlineTextRef = useRef<Text>(null);
    const onReadyWasCalled = useRef(false);
    const [truncatedContentText, setTruncatedContentText] = useState('');

    useEffect(() => {
      const headlineTextElement = headlineTextRef.current;

      if (headlineTextElement && headlineRef.current) {
        headlineTextElement.measureLayout(headlineRef.current, (_, _2, _3, height) => {
          const maxContentTextLength = height > formatSize(19) ? 40 : 80;
          const textToTruncate = contentText ?? '';

          setTruncatedContentText(
            textToTruncate.length > maxContentTextLength
              ? `${textToTruncate.slice(0, maxContentTextLength)}...`
              : textToTruncate
          );
        });
      }
    }, [contentText]);

    useEffect(() => {
      if (truncatedContentText && !onReadyWasCalled.current) {
        onReady();
        onReadyWasCalled.current = true;
      }
    }, [truncatedContentText, onReady]);

    const openLink = useCallback(() => openUrl(href), [href]);

    return (
      <TouchableWithAnalytics
        {...testIDProps}
        style={[styles.container, !isVisible && styles.invisible]}
        onPress={openLink}
      >
        <View style={styles.imageContainer}>
          <FastImage style={styles.image} source={{ uri: imageSrc }} resizeMode="contain" onError={onImageError} />
        </View>
        <View style={styles.textsContainer}>
          <View style={styles.headline} ref={headlineRef}>
            <Text style={styles.headlineText} ref={headlineTextRef}>
              {headline}
            </Text>
            <View style={styles.adLabel}>
              <Text style={styles.adLabelText}>AD</Text>
            </View>
          </View>
          {truncatedContentText ? <Text style={styles.content}>{truncatedContentText}</Text> : null}
        </View>
        {shouldShowCloseButton && (
          <TouchableWithAnalytics
            style={styles.closeButton}
            onPress={onClose}
            testID={TextPromotionItemSelectors.closeButton}
          >
            <Icon name={IconNameEnum.X} size={formatSize(16)} color={colors.peach} />
          </TouchableWithAnalytics>
        )}
      </TouchableWithAnalytics>
    );
  }
);
