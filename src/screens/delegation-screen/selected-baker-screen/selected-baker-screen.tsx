import React, { FC } from 'react';
import { Text } from 'react-native';

import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { BakerInterface } from '../../../interfaces/baker.interface';

interface Props {
  baker: BakerInterface;
}

export const SelectedBakerScreen: FC<Props> = ({ baker }) => {
  return (
    <ScreenContainer>
      <Text>Hi {baker.name}</Text>
    </ScreenContainer>
  );
};
