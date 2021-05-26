import React, { useEffect } from 'react';

import { useNavigation } from '../../navigator/use-navigation.hook';
import { IconNameEnum } from '../icon/icon-name.enum';
import { HeaderBackButton } from './header-back-button/header-back-button';
import { HeaderTitle } from './header-title/header-title';

export const useScreenHeader = (title: string) => {
  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({
      headerTitleAlign: 'center',
      headerTitle: () => <HeaderTitle title={title} />,
      headerLeft: () => <HeaderBackButton iconName={IconNameEnum.ArrowLeft} />
    });
  }, [title]);
};
