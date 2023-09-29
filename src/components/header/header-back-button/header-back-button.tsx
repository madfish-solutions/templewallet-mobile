import React, { FC } from 'react';

import { EmptyFn } from 'src/config/general';
import { isDefined } from 'src/utils/is-defined';

import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { HeaderButton } from '../header-button/header-button';

interface Props {
  onPress?: EmptyFn;
}

export const HeaderBackButton: FC<Props> = ({ onPress }) => {
  const { goBack } = useNavigation();

  const handleNavigate = () => {
    if (isDefined(onPress)) {
      return onPress();
    }

    goBack();
  };

  return <HeaderButton iconName={IconNameEnum.ArrowLeft} onPress={handleNavigate} />;
};
