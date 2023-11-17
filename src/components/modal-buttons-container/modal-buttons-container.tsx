import React, { FC } from 'react';
import { View } from 'react-native';

import { ButtonsContainer } from '../button/buttons-container/buttons-container';
import { InsetSubstitute } from '../inset-substitute/inset-substitute';

import { useModalButtonsContainerStyles } from './modal-buttons-container.styles';

export const ModalButtonsContainer: FC = ({ children }) => {
  const styles = useModalButtonsContainerStyles();

  return (
    <View style={styles.container}>
      <ButtonsContainer>{children}</ButtonsContainer>

      <InsetSubstitute type="bottom" />
    </View>
  );
};
