import React, { FC, memo } from 'react';
import { View, StyleProp, ViewStyle, ActivityIndicator } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { useColors } from 'src/styles/use-colors';

import { formatSize } from '../../styles/format-size';
import { openUrl } from '../../utils/linking.util';
import { Bage } from '../bage/bage';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableWithAnalytics } from '../touchable-with-analytics';
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
