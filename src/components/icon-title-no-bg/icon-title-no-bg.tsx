import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { TestIdProps } from 'src/interfaces/test-id.props';

import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';

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
    <TouchableOpacity style={styles.touchableOpacity} onPress={onPress} testID={testID}>
      <Icon name={icon} />
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};
