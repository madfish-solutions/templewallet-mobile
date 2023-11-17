import { StackNavigationOptions } from '@react-navigation/stack';
import React, { FC, useMemo } from 'react';

import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useExolixStep } from '../../store/exolix/exolix-selectors';
import { IconNameEnum } from '../icon/icon-name.enum';

import { HeaderButton } from './header-button/header-button';
import { HeaderProgress } from './header-progress/header-progress';
import { HeaderTitle } from './header-title/header-title';

const BackButton: FC = () => {
  const { goBack } = useNavigation();

  const handleOnPress = () => {
    goBack();
  };

  return <HeaderButton iconName={IconNameEnum.ArrowLeft} onPress={handleOnPress} />;
};

export const exolixScreenOptions = (): StackNavigationOptions => ({
  headerTitleAlign: 'center',
  headerLeft: () => <BackButton />,
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
        return 'Convertation';
      case 3:
      default:
        return 'Completed';
    }
  }, [step]);

  return <HeaderTitle title={text} />;
};

const Stepper: FC = () => {
  const step = useExolixStep();

  return <HeaderProgress current={step + 1 < 4 ? step + 1 : 4} total={4} />;
};
