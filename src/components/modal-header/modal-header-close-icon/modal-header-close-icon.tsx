import React from 'react';

import { useNavigation } from '../../../navigator/use-navigation.hook';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { TouchableIcon } from '../../icon/touchable-icon/touchable-icon';
import { ModalHeaderCloseIconStyles } from './modal-header-close-icon.styles';

export const ModalHeaderCloseIcon = () => {
  const { goBack } = useNavigation();

  return <TouchableIcon name={IconNameEnum.Close} style={ModalHeaderCloseIconStyles.icon} onPress={goBack} />;
};
