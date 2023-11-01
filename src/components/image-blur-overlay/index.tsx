import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { useThemeSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';

import { useBlurStyles } from './styles';

const ICON_SIZE_BIG = 40;
const ICON_SIZE_SMALL = 24;

interface Props {
  size: number;
  isBigIcon?: boolean;
  isTouchable?: boolean;
  /** (!) Not allowed if descendant of <TouchableOpacity /> */
  onPress?: EmptyFn;
}

export const ImageBlurOverlay = memo<Props>(({ size, isBigIcon = false, onPress }) => {
  const styles = useBlurStyles();
  const deviceTheme = useThemeSelector();

  const isLightTheme = deviceTheme === ThemesEnum.light;
  const iconSize = formatSize(isBigIcon ? ICON_SIZE_BIG : ICON_SIZE_SMALL);
  const iconName = isLightTheme ? IconNameEnum.BlurEyeBlack : IconNameEnum.BlurEyeWhite;
  const blurIcon = isLightTheme ? IconNameEnum.BlurLight : IconNameEnum.BlurDark;

  const children = (
    <>
      <Icon name={blurIcon} size={size} style={styles.blur} />

      <View style={styles.content}>
        <Icon name={iconName} size={iconSize} />
        {onPress ? <Text style={styles.text}>Tap to reveal</Text> : null}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.root}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={styles.root}>{children}</View>;
});
