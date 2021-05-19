import React, { FC } from 'react';
import { View } from 'react-native';

import { EmptyFn } from '../../../config/general';
import { formatSize } from '../../../styles/format-size';
import { ButtonSmall } from '../../button/button-small/button-small';
import { useButtonsStyles } from './buttons.styles';

interface Props {
  isInputMode: boolean;
  isShowGenerateNew: boolean;
  onGetNew: EmptyFn;
  onPaste: EmptyFn;
  onCopy: EmptyFn;
}

export const Buttons: FC<Props> = ({ isShowGenerateNew, isInputMode, onCopy, onPaste, onGetNew }) => {
  const styles = useButtonsStyles();

  return (
    <View style={styles.buttonsContainer}>
      {isInputMode ? (
        <ButtonSmall title="Paste" onPress={onPaste} />
      ) : (
        <>
          {isShowGenerateNew && <ButtonSmall marginRight={formatSize(8)} title="Get New" onPress={onGetNew} />}
          <ButtonSmall title="Copy" onPress={onCopy} />
        </>
      )}
    </View>
  );
};
