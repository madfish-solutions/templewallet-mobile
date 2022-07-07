import { StackNavigationOptions } from '@react-navigation/stack';
import React, { FC, useMemo } from 'react';

import { useExolixStep } from '../../store/exolix/exolix-selectors';
import { HeaderBackButton } from './header-back-button/header-back-button';
import { HeaderProgress } from './header-progress/header-progress';
import { HeaderTitle } from './header-title/header-title';

export const exolixScreenOptions = (): StackNavigationOptions => ({
  headerTitleAlign: 'center',
  headerLeft: () => <HeaderBackButton />,
  headerTitle: () => <TitleComponent />,
  headerRight: () => <Stepper />
});

const TitleComponent: FC = () => {
  const step = useExolixStep();

  const text = useMemo(() => {
    switch (step) {
      case 0:
        return 'Enter exchange details';
      case 1:
        return 'Deposit';
      case 2:
      case 3:
        return 'Convertation';
      case 4:
      default:
        return 'Completed';
    }
  }, [step]);

  return <HeaderTitle title={text} />;
};

const Stepper: FC = () => {
  const step = useExolixStep();

  return <HeaderProgress current={step < 3 ? step + 1 : step} total={4} />;
};
