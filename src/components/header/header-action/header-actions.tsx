import React, { FC } from 'react';
import { View } from 'react-native';

import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';

import { IconNameEnum } from '../../icon/icon-name.enum';
import { TouchableIcon } from '../../icon/touchable-icon/touchable-icon';

import { useHeaderTitleStyles } from './header-actions.styles';

export const HeaderAction: FC = () => {
  const styles = useHeaderTitleStyles();
  const { navigate } = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableIcon
        style={styles.icons}
        size={formatSize(20)}
        name={IconNameEnum.SwapSettings}
        onPress={() => navigate(ScreensEnum.SwapSettingsScreen)}
      />
    </View>
  );
};
