import React, { FC } from 'react';
import { View } from 'react-native';

import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { TouchableIcon } from '../../icon/touchable-icon/touchable-icon';
import { useHeaderCloseOptionsButtonStyles } from './header-close-options-button.styles';

export const HeaderCloseOptionsButton: FC = () => {
  const styles = useHeaderCloseOptionsButtonStyles();
  const { navigate } = useNavigation();

  return (
    <View style={styles.accountActionsContainer}>
      {/* TODO: uncomment after figure out why we need options here */}
      {/* <TouchableIcon
        size={formatSize(16)}
        name={IconNameEnum.MoreHorizontal}
        disabled={true}
        onPress={() => navigate(ScreensEnum.DApps)}
      />
      <View style={styles.verticalLineDivider} /> */}
      <TouchableIcon size={formatSize(16)} name={IconNameEnum.XCircle} onPress={() => navigate(ScreensEnum.DApps)} />
    </View>
  );
};
