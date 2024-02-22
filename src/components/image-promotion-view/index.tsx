import React, { useCallback, memo, PropsWithChildren } from 'react';
import { View } from 'react-native';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { openUrl } from 'src/utils/linking';

import { Bage } from '../bage/bage';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableWithAnalytics } from '../touchable-with-analytics';

import { PromotionItemSelectors } from './selectors';
import { useImagePromotionViewStyles } from './styles';

interface ImagePromotionViewProps extends TestIdProps {
  href: string;
  isVisible: boolean;
  shouldShowCloseButton: boolean;
  shouldShowAdBage: boolean;
  onClose: EmptyFn;
}

export const ImagePromotionView = memo<PropsWithChildren<ImagePromotionViewProps>>(
  ({ children, href, isVisible, shouldShowCloseButton, shouldShowAdBage, onClose, ...testIDProps }) => {
    const colors = useColors();
    const styles = useImagePromotionViewStyles();

    const openLink = useCallback(() => openUrl(href), [href]);

    return (
      <TouchableWithAnalytics
        {...testIDProps}
        style={[styles.container, !isVisible && styles.invisible]}
        onPress={openLink}
      >
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
