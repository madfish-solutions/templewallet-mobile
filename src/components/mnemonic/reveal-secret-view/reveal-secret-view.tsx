import Clipboard from '@react-native-clipboard/clipboard';
import React, { FC } from 'react';
import { View } from 'react-native';

import { EmptyFn } from '../../../config/general';
import { isString } from '../../../utils/is-string';
import { ButtonSmallSecondary } from '../../button/button-small/button-small-secondary/button-small-secondary';
import { StyledTextInput } from '../../styled-text-input/styled-text-input';
import { useMnemonicStyles } from '../mnemonic.styles';
import { ProtectedOverlay } from '../protected-overlay/protected-overlay';

interface Props {
  value?: string;
  onProtectedOverlayPress: EmptyFn;
}

export const RevealSecretView: FC<Props> = ({ value, onProtectedOverlayPress }) => {
  const styles = useMnemonicStyles();

  return (
    <View style={styles.container}>
      <StyledTextInput value={value} editable={false} multiline={true} />
      <View style={styles.buttonsContainer}>
        <ButtonSmallSecondary title="COPY" onPress={() => isString(value) && Clipboard.setString(value)} />
      </View>
      {!isString(value) && <ProtectedOverlay onPress={onProtectedOverlayPress} />}
    </View>
  );
};
