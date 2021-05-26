import React, { useEffect } from 'react';

import { useNavigation } from '../../navigator/use-navigation.hook';
import { formatSize } from '../../styles/format-size';
import { ModalHeaderCloseIcon } from './modal-header-close-icon/modal-header-close-icon';
import { ModalHeaderProgress } from './modal-header-progress/modal-header-progress';
import { ProgressInterface } from './modal-header-progress/progress.interface';
import { ModalHeaderTitle } from './modal-header-title/modal-header-title';

export const useModalHeader = (title: string, progress?: ProgressInterface) => {
  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({
      headerStatusBarHeight: 0,
      headerStyle: { height: formatSize(60) },
      headerTitleContainerStyle: { alignItems: 'center' },
      headerTitle: () => <ModalHeaderTitle title={title} />,
      headerLeft: () => <ModalHeaderProgress progress={progress} />,
      headerRight: ModalHeaderCloseIcon
    });
  }, [title, progress]);
};
