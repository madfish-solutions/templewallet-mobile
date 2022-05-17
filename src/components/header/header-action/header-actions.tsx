import React, { FC } from 'react';
import { View } from 'react-native';

import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { TouchableIcon } from '../../icon/touchable-icon/touchable-icon';
import { useHeaderTitleStyles } from './header-actions.styles';

export const HeaderAction: FC = () => {
  const styles = useHeaderTitleStyles();
  const { navigate } = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableIcon
        size={formatSize(30)}
        name={IconNameEnum.SwapInfo}
        onPress={() => navigate(ScreensEnum.SwapQuestionsScreen)}
      />
      <TouchableIcon
        style={styles.icons}
        size={formatSize(20)}
        name={IconNameEnum.SwapSettings}
        onPress={() => navigate(ScreensEnum.SwapSettingsScreen)}
      />
    </View>
  );
};
