import React from 'react';
import { Button } from 'react-native';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { useAppLock } from '../../shelter/use-app-lock.hook';
import { EraseDataButton } from './erase-data-button/erase-data-button';

export const Settings = () => {
  const { lock } = useAppLock();

  return (
    <ScreenContainer hasBackButton={false}>
      <Button title="Lock app" onPress={lock} />
      <EraseDataButton />
    </ScreenContainer>
  );
};
