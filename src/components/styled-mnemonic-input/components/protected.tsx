import React, { FC } from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';

import { EmptyFn } from '../../../config/general';
import { formatSize } from '../../../styles/format-size';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { useStyledMnemonicInputStyles } from '../styled-mnemonic-input.styles';

interface Props {
  onReveal: EmptyFn;
}

export const Protected: FC<Props> = ({ onReveal }) => {
  const styles = useStyledMnemonicInputStyles();

  return (
    <>
      <Image style={styles.protectedImage} source={require('./mnemonic-bg.gif')} />
      <TouchableOpacity onPress={onReveal} style={styles.protectedView}>
        <Icon name={IconNameEnum.Lock} size={formatSize(40)} />
        <Text style={styles.title}>Protected</Text>
        <Text style={styles.secondTitle}>Tap to reveal</Text>
      </TouchableOpacity>
    </>
  );
};
