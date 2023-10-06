import React, { FC, memo } from 'react';
import { View, StyleProp, ViewStyle, ActivityIndicator } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';

import { Bage } from 'src/components/bage/bage';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { openUrl } from 'src/utils/linking';

import { PromotionItemSelectors } from './promotion-item.selectors';
import { usePromotionItemStyles } from './promotion-item.styles';

interface Props extends TestIdProps {
  source: Source | string;
  link: string;
  loading?: boolean;
  shouldShowAdBage?: boolean;
  shouldShowCloseButton?: boolean;
  style?: StyleProp<ViewStyle>;
  onCloseButtonClick?: () => void;
  onImageError?: () => void;
}

export const PromotionItem: FC<Props> = memo(
  ({
    testID,
    source,
    link,
    loading = false,
    shouldShowAdBage = false,
    shouldShowCloseButton = false,
    style,
    onCloseButtonClick,
    onImageError
  }) => {
    const colors = useColors();
    const styles = usePromotionItemStyles();

    return (
      <TouchableWithAnalytics testID={testID} style={[styles.container, style]} onPress={() => openUrl(link)}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={styles.rewardContainer}>
            {shouldShowAdBage && (
              <View style={styles.bageContainer}>
                <Bage text="AD" />
              </View>
            )}
            {shouldShowCloseButton && (
              <TouchableWithAnalytics
                style={styles.closeButton}
                onPress={onCloseButtonClick}
                testID={PromotionItemSelectors.closeButton}
              >
                <Icon name={IconNameEnum.XBold} size={formatSize(9.43)} color={colors.peach} />
              </TouchableWithAnalytics>
            )}
            {typeof source === 'string' ? (
              <SvgUri
                style={styles.bannerImage}
                height={formatSize(112)}
                width={formatSize(343)}
                uri={source}
                onError={onImageError}
              />
            ) : (
              <FastImage style={styles.bannerImage} source={source} onError={onImageError} />
            )}
          </View>
        )}
      </TouchableWithAnalytics>
    );
  }
);
