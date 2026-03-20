import React, { Children, Fragment } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { formatSize } from 'src/styles/format-size';

import { useModalButtonsFloatingContainerStyles } from './styles';

interface Props {
  variant?: 'bordered' | 'minimal';
  style?: StyleProp<ViewStyle>;
}

export const ModalButtonsFloatingContainer: FCWithChildren<Props> = ({ children, variant = 'minimal', style }) => {
  const styles = useModalButtonsFloatingContainerStyles();

  return (
    <>
      <ButtonsFloatingContainer style={[styles.container, styles[variant], style]}>
        {Children.map(children, (child, index) => (
          <Fragment key={index}>
            <View style={styles.flex}>{child}</View>
            {index < Children.count(children) - 1 && <Divider size={formatSize(16)} />}
          </Fragment>
        ))}
      </ButtonsFloatingContainer>
      <InsetSubstitute type="bottom" />
    </>
  );
};
