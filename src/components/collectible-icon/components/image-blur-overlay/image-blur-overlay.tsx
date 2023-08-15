import React, { FC, memo } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { EventFn } from '../../../../config/general';
import { ThemesEnum } from '../../../../interfaces/theme.enum';
import { useThemeSelector } from '../../../../store/settings/settings-selectors';
import { formatSize } from '../../../../styles/format-size';
import { conditionalStyle } from '../../../../utils/conditional-style';
import { Icon } from '../../../icon/icon';
import { IconNameEnum } from '../../../icon/icon-name.enum';
import { useBlurStyles } from './image-blur-overlay.styles';

export enum ImageBlurOverlaySizesEnum {
  Small = 'Small',
  Big = 'Big'
}

const ICON_SIZE_BIG = 40;
const ICON_SIZE_SMALL = 24;

interface Props {
  size: number;
  isShowBlur: boolean;
  setIsShowBlur: EventFn<boolean>;
  overlaySize?: ImageBlurOverlaySizesEnum;
  isTouchableOverlay?: boolean;
}

export const ImageBlurOverlay: FC<Props> = memo(
  ({ size, isShowBlur, overlaySize = ImageBlurOverlaySizesEnum.Small, setIsShowBlur, isTouchableOverlay = false }) => {
    const styles = useBlurStyles();
    const deviceTheme = useThemeSelector();

    const isBigOverlay = overlaySize === ImageBlurOverlaySizesEnum.Big;
    const isLightTheme = deviceTheme === ThemesEnum.light;
    const iconSize = isBigOverlay ? ICON_SIZE_BIG : ICON_SIZE_SMALL;
    const iconName = isLightTheme ? IconNameEnum.BlurEyeBlack : IconNameEnum.BlurEyeWhite;
    const blurIcon = isLightTheme ? IconNameEnum.BlurLight : IconNameEnum.BlurDark;

    const handleLayoutPress = () => {
      if (isTouchableOverlay) {
        setIsShowBlur(false);
      }
    };

    return (
      <TouchableOpacity activeOpacity={1} onPress={handleLayoutPress} style={styles.root}>
        {isShowBlur && (
          <View style={[styles.blurContainer]}>
            <Icon name={blurIcon} size={size} />

            <View style={styles.container}>
              <Icon
                name={iconName}
                size={formatSize(iconSize)}
                style={[conditionalStyle(isBigOverlay, styles.marginBottom)]}
              />
              {isTouchableOverlay && <Text style={styles.text}>Tap to reveal</Text>}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }
);
