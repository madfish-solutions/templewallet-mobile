import { StackNavigationOptions } from '@react-navigation/stack';
import React, { FC, useMemo } from 'react';
import { Text } from 'react-native';

import { useExolixStep } from '../../store/exolix/exolix-selectors';
import { HeaderBackButton } from './header-back-button/header-back-button';
import { HeaderProgress } from './header-progress/header-progress';

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
      case 1:
        return 'Enter exchange details';
      case 2:
        return 'Deposit';
      case 3:
        return 'Convertation';
      case 4:
      default:
        return 'Completed';
    }
  }, [step]);

  return <Text>{text}</Text>;
};

const Stepper: FC = () => {
  const step = useExolixStep();

  return <HeaderProgress current={step} total={4} />;
};
