import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { useThemeSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { conditionalStyle } from 'src/utils/conditional-style';

import { useBlurStyles } from './styles';

const ICON_SIZE_BIG = 40;
const ICON_SIZE_SMALL = 24;

interface Props {
  size: number;
  isBigIcon?: boolean;
  isTouchable?: boolean;
  onPress?: EmptyFn;
}

export const ImageBlurOverlay = memo<Props>(({ size, isBigIcon = false, onPress }) => {
  const styles = useBlurStyles();
  const deviceTheme = useThemeSelector();

  const isLightTheme = deviceTheme === ThemesEnum.light;
  const iconSize = isBigIcon ? ICON_SIZE_BIG : ICON_SIZE_SMALL;
  const iconName = isLightTheme ? IconNameEnum.BlurEyeBlack : IconNameEnum.BlurEyeWhite;
  const blurIcon = isLightTheme ? IconNameEnum.BlurLight : IconNameEnum.BlurDark;

  const handleLayoutPress = () => void onPress?.();

  return (
    <TouchableOpacity activeOpacity={1} onPress={handleLayoutPress} style={styles.root}>
      <View style={[styles.blurContainer]}>
        <Icon name={blurIcon} size={size} />

        <View style={styles.container}>
          <Icon
            name={iconName}
            size={formatSize(iconSize)}
            style={[conditionalStyle(!!onPress, styles.marginBottom)]}
          />
          {onPress ? <Text style={styles.text}>Tap to reveal</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
});
