import { entropyToMnemonic } from 'bip39';
import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { symmetricKey64 } from 'react-native-themis';

import { emptyFn } from '../../../config/general';
import { useActiveTimer } from '../../../hooks/use-active-timer.hook';
import { formatSize } from '../../../styles/format-size';
import { copyStringToClipboard } from '../../../utils/clipboard.utils';
import { isString } from '../../../utils/is-string';
import { ButtonSmallSecondary } from '../../button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from '../../divider/divider';
import { StyledTextInput } from '../../styled-text-input/styled-text-input';
import { StyledTextInputStyles } from '../../styled-text-input/styled-text-input.styles';
import { OVERLAY_SHOW_TIMEOUT } from '../mnemonic.config';
import { MnemonicProps } from '../mnemonic.props';
import { MnemonicStyles } from '../mnemonic.styles';
import { ProtectedOverlay } from '../protected-overlay/protected-overlay';
import { MnemonicCreateSelectors } from './mnemonic-create.selectors';

export const MnemonicCreate: FC<MnemonicProps> = ({ value, isError, onChangeText = emptyFn, onBlur, testID }) => {
  const { activeTimer, clearActiveTimer } = useActiveTimer();

  const [isShowOverlay, setIsShowOverlay] = useState(isString(value));

  const hideOverlay = () => {
    clearActiveTimer();

    setIsShowOverlay(false);
    activeTimer.current = setTimeout(() => setIsShowOverlay(true), OVERLAY_SHOW_TIMEOUT);
  };

  const handleGenerateNewButtonPress = () => {
    symmetricKey64().then((key64: string) => {
      const entropy = Array.from(Buffer.from(key64, 'base64'));
      const mnemonic = entropyToMnemonic(Buffer.from(entropy.slice(0, 16)));
      onChangeText(mnemonic);
      hideOverlay();
    });
  };

  return (
    <View style={MnemonicStyles.container}>
      <StyledTextInput
        value={value}
        isError={isError}
        editable={false}
        multiline={true}
        style={StyledTextInputStyles.mnemonicInput}
        onBlur={onBlur}
        onChangeText={onChangeText}
        testID={testID}
      />
      <View style={MnemonicStyles.buttonsContainer}>
        <ButtonSmallSecondary
          title="GEN NEW"
          onPress={handleGenerateNewButtonPress}
          testID={MnemonicCreateSelectors.GenNewSeedButton}
        />
        {isString(value) ? (
          <>
            <Divider size={formatSize(8)} />
            <ButtonSmallSecondary
              title="COPY"
              onPress={() => copyStringToClipboard(value)}
              testID={MnemonicCreateSelectors.CopyButton}
            />
          </>
        ) : null}
      </View>
      {isShowOverlay && <ProtectedOverlay onPress={hideOverlay} />}
    </View>
  );
};
