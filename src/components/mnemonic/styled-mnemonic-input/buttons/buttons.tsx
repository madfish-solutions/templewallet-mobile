import React, { FC } from 'react';
import { View } from 'react-native';

import { EmptyFn } from '../../../../config/general';
import { formatSize } from '../../../../styles/format-size';
import { ButtonSmallSecondary } from '../../../button/button-small/button-small-secondary/button-small-secondary';
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
        <ButtonSmallSecondary title="Paste" onPress={onPaste} />
      ) : (
        <>
          {isShowGenerateNew && <ButtonSmallSecondary marginRight={formatSize(8)} title="Get New" onPress={onGetNew} />}
          <ButtonSmallSecondary title="Copy" onPress={onCopy} />
        </>
      )}
    </View>
  );
};
