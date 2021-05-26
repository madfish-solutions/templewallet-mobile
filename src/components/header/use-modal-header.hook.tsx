import React, { useEffect } from 'react';

import { useNavigation } from '../../navigator/use-navigation.hook';
import { formatSize } from '../../styles/format-size';
import { IconNameEnum } from '../icon/icon-name.enum';
import { HeaderBackButton } from './header-back-button/header-back-button';
import { HeaderProgress } from './header-progress/header-progress';
import { ProgressInterface } from './header-progress/progress.interface';
import { HeaderTitle } from './header-title/header-title';

export const useModalHeader = (title: string, progress?: ProgressInterface) => {
  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({
      headerTitleAlign: 'center',
      headerStatusBarHeight: 0,
      headerStyle: { height: formatSize(60) },
      headerTitle: () => <HeaderTitle title={title} />,
      headerLeft: () => <HeaderProgress progress={progress} />,
      headerRight: () => <HeaderBackButton iconName={IconNameEnum.Close} />
    });
  }, [title, progress]);
};
