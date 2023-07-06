import React, { FC } from 'react';

import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { HeaderButton } from '../header-button/header-button';

export const HeaderCloseButton: FC = () => {
  const { goBack } = useNavigation();

  return <HeaderButton iconName={IconNameEnum.Close} onPress={goBack} />;
};
