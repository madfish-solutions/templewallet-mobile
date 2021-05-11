import React from 'react';
import { Image, View, Text } from 'react-native';

import { formatSize } from '../../../styles/format-size';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { useStyledMnemonicInputStyles } from '../styled-mnemonic-input.styles';

export const Protected = () => {
  const styles = useStyledMnemonicInputStyles();

  return (
    <>
      <Image style={styles.protectedImage} source={require('./mnemonic-bg.gif')} />
      <View style={styles.protectedView}>
        <Icon name={IconNameEnum.Lock} size={formatSize(40)} />
        <Text style={styles.title}>Protected</Text>
        <Text style={styles.secondTitle}>Tap to reveal</Text>
      </View>
    </>
  );
};
