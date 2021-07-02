import React, { FC } from 'react';
import { View } from 'react-native';

import { EmptyFn } from '../../../config/general';
import { copyStringToClipboard } from '../../../utils/clipboard.utils';
import { isString } from '../../../utils/is-string';
import { ButtonSmallSecondary } from '../../button/button-small/button-small-secondary/button-small-secondary';
import { StyledTextInput } from '../../styled-text-input/styled-text-input';
import { StyledTextInputStyles } from '../../styled-text-input/styled-text-input.styles';
import { MnemonicStyles } from '../mnemonic.styles';
import { ProtectedOverlay } from '../protected-overlay/protected-overlay';

interface Props {
  value?: string;
  onProtectedOverlayPress: EmptyFn;
}

export const RevealSecretView: FC<Props> = ({ value, onProtectedOverlayPress }) => (
  <View style={MnemonicStyles.container}>
    <StyledTextInput value={value} editable={false} multiline={true} style={StyledTextInputStyles.mnemonicInput} />
    <View style={MnemonicStyles.buttonsContainer}>
      <ButtonSmallSecondary title="COPY" onPress={() => copyStringToClipboard(value)} />
    </View>
    {!isString(value) && <ProtectedOverlay onPress={onProtectedOverlayPress} />}
  </View>
);
