import React, { FC } from 'react';
import { View } from 'react-native';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { isString } from 'src/utils/is-string';

import { ButtonSmallSecondary } from '../../button/button-small/button-small-secondary/button-small-secondary';
import { StyledTextInput } from '../../styled-text-input/styled-text-input';
import { StyledTextInputStyles } from '../../styled-text-input/styled-text-input.styles';
import { MnemonicStyles } from '../mnemonic.styles';
import { ProtectedOverlay } from '../protected-overlay/protected-overlay';

import { RevealSecretViewSelectors } from './reveal-secret-view.selectors';

interface Props extends TestIdProps {
  value?: string;
  onProtectedOverlayPress: EmptyFn;
}

export const RevealSecretView: FC<Props> = ({ value, onProtectedOverlayPress, testID }) => (
  <View style={MnemonicStyles.container}>
    <StyledTextInput
      value={value}
      editable={false}
      multiline={true}
      style={StyledTextInputStyles.mnemonicInput}
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
