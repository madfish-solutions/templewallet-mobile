import { BlurView } from '@react-native-community/blur';
import React, { FC, useState } from 'react';
import { Text, View } from 'react-native';

import { ThemesEnum } from '../../interfaces/theme.enum';
import { useThemeSelector } from '../../store/settings/settings-selectors';
import { conditionalStyle } from '../../utils/conditional-style';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useBlurStyles } from './iimage-blur-overlay.styles';

export enum ImageBlurOverlayThemesEnum {
  fullView = 'fullView',
  list = 'list'
}

const BLUR_AMOUNT = 30;
const ICON_SIZE_BIG = 40;
const ICON_SIZE_SMALL = 24;

interface Props {
  theme?: ImageBlurOverlayThemesEnum;
  isTouchableOverlay?: boolean;
}

export const ImageBlurOverlay: FC<Props> = ({
  theme = ImageBlurOverlayThemesEnum.list,
  isTouchableOverlay = true,
  children
}) => {
  const styles = useBlurStyles();
  const deviceTheme = useThemeSelector();

  const [blurValue, setBlurValue] = useState(BLUR_AMOUNT);

  const isFullViewTheme = theme === ImageBlurOverlayThemesEnum.fullView;
  const isLightTheme = deviceTheme === ThemesEnum.light;
  const blurType = isLightTheme ? 'xlight' : 'materialDark';
  const iconSize = isFullViewTheme ? ICON_SIZE_BIG : ICON_SIZE_SMALL;
  const iconName = isLightTheme ? IconNameEnum.BlurEyeBlack : IconNameEnum.BlurEyeWhite;

  const handleLayoutPress = () => {
    if (isTouchableOverlay) {
      setBlurValue(0);
    }
  };

  return (
    <View style={styles.root}>
      {children}

      {blurValue === BLUR_AMOUNT && (
        <View style={styles.blurContainer}>
          <BlurView
            blurAmount={blurValue}
            blurType={blurType}
            onTouchStart={handleLayoutPress}
            style={styles.blurLayout}
          />
          <Icon name={iconName} size={iconSize} style={[conditionalStyle(isFullViewTheme, styles.marginBottom)]} />
          {isFullViewTheme && <Text style={styles.text}>Tap to reveal</Text>}
        </View>
      )}
    </View>
  );
};
