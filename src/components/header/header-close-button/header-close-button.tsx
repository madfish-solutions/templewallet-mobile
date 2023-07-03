import React, { FC } from 'react';

import { EmptyFn } from 'src/config/general';

import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { HeaderButton } from '../header-button/header-button';

interface Props {
  onPress?: EmptyFn;
}

export const HeaderCloseButton: FC<Props> = ({ onPress }) => {
  const { goBack } = useNavigation();

  const handlePress = () => {
    onPress?.();
    goBack();
  };

  return <HeaderButton iconName={IconNameEnum.Close} onPress={handlePress} />;
};
