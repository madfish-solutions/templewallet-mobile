import { useClipboard } from '@react-native-clipboard/clipboard';
import React from 'react';
import { View } from 'react-native';

import { formatSize } from '../../../styles/format-size';
import { generateSeed } from '../../../utils/keys.util';
import { ButtonSmall } from '../../button/button-small/button-small';
import { useStyledMnemonicInputStyles } from '../styled-mnemonic-input.styles';

interface Props {
  value: string | undefined;
  onChangeText: (v: string) => void;
  isProtected?: boolean;
}

export const Buttons = ({ onChangeText, value, isProtected }: Props) => {
  const styles = useStyledMnemonicInputStyles();

  const [data, setString] = useClipboard();

  return (
    <View style={styles.buttonsContainer}>
      {isProtected ? (
        <ButtonSmall onPress={() => setString(value || '')} title={'Copy'} />
      ) : (
        <>
          <ButtonSmall marginRight={formatSize(8)} onPress={() => onChangeText(generateSeed())} title={'Get New'} />
          <ButtonSmall onPress={() => onChangeText(data)} title={'Paste'} />
        </>
      )}
    </View>
  );
};
