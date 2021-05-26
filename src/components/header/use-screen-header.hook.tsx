import { FC, useEffect } from 'react';

import { emptyComponent } from '../../config/general';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { HeaderBackButton } from './header-back-button/header-back-button';

export const useScreenHeader = (headerTitle: FC, headerRight: FC = emptyComponent) => {
  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({
      headerTitleAlign: 'center',
      headerLeft: HeaderBackButton,
      headerTitle,
      headerRight
    });
  }, [headerTitle, headerRight]);
};
