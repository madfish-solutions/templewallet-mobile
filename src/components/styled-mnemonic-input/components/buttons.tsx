import React from 'react';
import { View } from 'react-native';

import { EmptyFn } from '../../../config/general';
import { formatSize } from '../../../styles/format-size';
import { ButtonSmall } from '../../button/button-small/button-small';
import { useStyledMnemonicInputStyles } from '../styled-mnemonic-input.styles';

interface Props {
  isProtected?: boolean;
  isEditable?: boolean;
  isHideGetNew?: boolean;
  onGetNew: EmptyFn;
  onPaste: EmptyFn;
  onCopy: EmptyFn;
}

export const Buttons = ({ isHideGetNew, isEditable, isProtected, onCopy, onPaste, onGetNew }: Props) => {
  const styles = useStyledMnemonicInputStyles();

  return (
    <View style={styles.buttonsContainer}>
      {isProtected || !isEditable ? (
        <ButtonSmall onPress={onCopy} title={'Copy'} />
      ) : (
        <>
          {!isHideGetNew && <ButtonSmall marginRight={formatSize(8)} title={'Get New'} onPress={onGetNew} />}
          <ButtonSmall title={'Paste'} onPress={onPaste} />
        </>
      )}
    </View>
  );
};
