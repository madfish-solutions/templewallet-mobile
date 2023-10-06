import React, { FC, memo } from 'react';
import { ActivityIndicator, StyleProp, Text, View, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';

import { emptyFn } from 'src/config/general';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { openUrl } from 'src/utils/linking';

import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableWithAnalytics } from '../touchable-with-analytics';
import { TextPromotionItemSelectors } from './text-promotion-item.selectors';
import { useTextPromotionItemStyles } from './text-promotion-item.styles';

interface Props extends TestIdProps {
  content: string;
  headline: string;
  imageUri: string;
  link: string;
  loading?: boolean;
  shouldShowCloseButton: boolean;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
  onImageError?: () => void;
}

export const TextPromotionItem: FC<Props> = memo(
  ({
    content,
    headline,
    imageUri,
    link,
    loading = false,
    shouldShowCloseButton,
    style,
    testID,
    onClose = emptyFn,
    onImageError
  }) => {
    const colors = useColors();
    const styles = useTextPromotionItemStyles();

    return (
      <TouchableWithAnalytics testID={testID} style={[styles.container, style]} onPress={() => openUrl(link)}>
        {loading ? (
          <View style={[styles.loaderContainer, style]}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <View style={styles.imageContainer}>
              <FastImage style={styles.image} source={{ uri: imageUri }} resizeMode="contain" onError={onImageError} />
            </View>
            <View style={styles.textsContainer}>
              <View style={styles.headline}>
                <Text style={styles.headlineText}>{headline}</Text>
                <View style={styles.adLabel}>
                  <Text style={styles.adLabelText}>AD</Text>
                </View>
              </View>
              <Text style={styles.content}>{content}</Text>
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
          </>
        )}
      </TouchableWithAnalytics>
    );
  }
);
