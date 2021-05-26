import React, { FC } from 'react';

import { useNavigation } from '../../../navigator/use-navigation.hook';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { TouchableIcon } from '../../icon/touchable-icon/touchable-icon';
import { HeaderBackButtonStyles } from './header-back-button.styles';

interface Props {
  iconName: IconNameEnum;
}

export const HeaderBackButton: FC<Props> = ({ iconName }) => {
  const { goBack } = useNavigation();

  return <TouchableIcon name={iconName} style={HeaderBackButtonStyles.icon} onPress={goBack} />;
};
