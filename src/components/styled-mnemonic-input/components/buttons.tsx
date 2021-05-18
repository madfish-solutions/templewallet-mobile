import React, { FC } from 'react';
import { View } from 'react-native';

import { EmptyFn } from '../../../config/general';
import { formatSize } from '../../../styles/format-size';
import { ButtonSmall } from '../../button/button-small/button-small';
import { useStyledMnemonicInputStyles } from '../styled-mnemonic-input.styles';

interface Props {
  isProtected: boolean;
  isEditable: boolean;
  isShowGetNew: boolean;
  onGetNew: EmptyFn;
  onPaste: EmptyFn;
  onCopy: EmptyFn;
}

export const Buttons: FC<Props> = ({ isShowGetNew, isEditable, isProtected, onCopy, onPaste, onGetNew }) => {
  const styles = useStyledMnemonicInputStyles();

  return (
    <View style={styles.buttonsContainer}>
      {isProtected || !isEditable ? (
        <ButtonSmall onPress={onCopy} title="Copy" />
      ) : (
        <>
          {isShowGetNew && <ButtonSmall marginRight={formatSize(8)} title="Get New" onPress={onGetNew} />}
          <ButtonSmall title="Paste" onPress={onPaste} />
        </>
      )}
    </View>
  );
};
