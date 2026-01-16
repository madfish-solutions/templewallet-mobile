import React, { Children, Fragment } from 'react';
import { View } from 'react-native';

import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';

export const WalletInitButtonsFloatingContainer: FCWithChildren = ({ children }) => {
  const styles = useSetPasswordScreensCommonStyles();

  return (
    <ButtonsFloatingContainer style={styles.buttonsFloatingContainer}>
      <ButtonsContainer style={styles.buttonsContainer}>
        {Children.map(children, (child, index) => (
          <Fragment key={index}>
            <View style={styles.flex}>{child}</View>
            {index < Children.count(children) - 1 && <Divider size={formatSize(15)} />}
          </Fragment>
        ))}
      </ButtonsContainer>
      <InsetSubstitute type="bottom" />
    </ButtonsFloatingContainer>
  );
};
