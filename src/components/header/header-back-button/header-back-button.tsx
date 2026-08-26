import React, { FC } from 'react';

import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';

import { HeaderButton } from '../header-button/header-button';

export const HeaderBackButton: FC = () => {
  const { goBack } = useNavigation();

  return <HeaderButton iconName={IconNameV2Enum.ArrowLeft} onPress={goBack} />;
};
