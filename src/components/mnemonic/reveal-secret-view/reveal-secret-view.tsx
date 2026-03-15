import React, { FC } from 'react';
import { StyleProp, TextStyle, View } from 'react-native';

import { EmptyFn } from '../../../config/general';
import { TestIdProps } from '../../../interfaces/test-id.props';
import { copyStringToClipboard } from '../../../utils/clipboard.utils';
import { isString } from '../../../utils/is-string';
import { ButtonSmallSecondary } from '../../button/button-small/button-small-secondary/button-small-secondary';
import { StyledTextInput } from '../../styled-text-input/styled-text-input';
import { StyledTextInputStyles } from '../../styled-text-input/styled-text-input.styles';
import { MnemonicStyles } from '../mnemonic.styles';
import { ProtectedOverlay } from '../protected-overlay/protected-overlay';

import { RevealSecretViewSelectors } from './reveal-secret-view.selectors';

interface Props extends TestIdProps {
  value?: string;
  onProtectedOverlayPress: EmptyFn;
  style?: StyleProp<TextStyle>;
}

export const RevealSecretView: FC<Props> = ({ value, onProtectedOverlayPress, style, testID }) => (
  <View style={MnemonicStyles.container}>
    <StyledTextInput
      value={value}
      editable={false}
      multiline={true}
      style={[StyledTextInputStyles.mnemonicInput, style]}
      testID={testID}
    />
    <View style={MnemonicStyles.buttonsContainer}>
      <ButtonSmallSecondary
        title="COPY"
        onPress={() => copyStringToClipboard(value)}
        testID={RevealSecretViewSelectors.copyButton}
      />
    </View>
    {!isString(value) && <ProtectedOverlay onPress={onProtectedOverlayPress} />}
  </View>
);
