import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { TestIdProps } from 'src/interfaces/test-id.props';

import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { SafeTouchableOpacity } from '../safe-touchable-opacity';

import { useIconTitleNoBgStyles } from './icon-title-no-bg.styles';

interface Props extends TestIdProps {
  text: string;
  icon: IconNameEnum;
  textStyle?: StyleProp<TextStyle>;
  onPress: EmptyFn;
}

export const IconTitleNoBg: FC<Props> = ({ text, icon, textStyle, onPress, testID }) => {
  const styles = useIconTitleNoBgStyles();

  return (
    <SafeTouchableOpacity style={styles.touchableOpacity} onPress={onPress} testID={testID}>
      <Icon name={icon} />
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </SafeTouchableOpacity>
  );
};
