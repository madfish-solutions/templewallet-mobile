import React, { FC, memo } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { EventFn } from '../../config/general';
import { ThemesEnum } from '../../interfaces/theme.enum';
import { useThemeSelector } from '../../store/settings/settings-selectors';
import { conditionalStyle } from '../../utils/conditional-style';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useBlurStyles } from './image-blur-overlay.styles';

export enum ImageBlurOverlayThemesEnum {
  fullView = 'fullView',
  list = 'list'
}

const ICON_SIZE_BIG = 40;
const ICON_SIZE_SMALL = 24;

interface Props {
  size: number;
  isShowBlur: boolean;
  setIsShowBlur: EventFn<boolean>;
  theme?: ImageBlurOverlayThemesEnum;
  isTouchableOverlay?: boolean;
}

export const ImageBlurOverlay: FC<Props> = memo(
  ({
    size,
    isShowBlur,
    setIsShowBlur,
    theme = ImageBlurOverlayThemesEnum.list,
    isTouchableOverlay = true,
    children
  }) => {
    const styles = useBlurStyles();
    const deviceTheme = useThemeSelector();

    const isFullViewTheme = theme === ImageBlurOverlayThemesEnum.fullView;
    const isLightTheme = deviceTheme === ThemesEnum.light;
    const iconSize = isFullViewTheme ? ICON_SIZE_BIG : ICON_SIZE_SMALL;
    const iconName = isLightTheme ? IconNameEnum.BlurEyeBlack : IconNameEnum.BlurEyeWhite;
    const blurIcon = isLightTheme ? IconNameEnum.BlurLight : IconNameEnum.BlurDark;

    const handleLayoutPress = () => {
      if (isTouchableOverlay) {
        setIsShowBlur(false);
      }
    };

    return (
      <TouchableOpacity activeOpacity={1} onPress={handleLayoutPress} style={styles.root}>
        {children}

        {isShowBlur && (
          <View style={[styles.blurContainer]}>
            <Icon name={blurIcon} size={size} />

            <View style={styles.container}>
              <Icon name={iconName} size={iconSize} style={[conditionalStyle(isFullViewTheme, styles.marginBottom)]} />
              {isFullViewTheme && <Text style={styles.text}>Tap to reveal</Text>}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }
);
