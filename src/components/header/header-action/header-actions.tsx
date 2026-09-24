import React, { FC } from 'react';
import { View } from 'react-native';

import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';

import { IconNameV2Enum } from '../../icon-v2/icon-name.enum.ts';
import { TouchableIconV2 } from '../../touchable-icon-v2';

import { useHeaderTitleStyles } from './header-actions.styles';

export const HeaderAction: FC = () => {
  const styles = useHeaderTitleStyles();
  const navigateToScreen = useNavigateToScreen();

  return (
    <View style={styles.container}>
      <TouchableIconV2
        style={styles.icons}
        size={formatSize(24)}
        iconSize={24}
        name={IconNameV2Enum.Slider}
        onPress={() => navigateToScreen({ screen: ScreensEnum.SwapSettingsScreen })}
      />
    </View>
  );
};
