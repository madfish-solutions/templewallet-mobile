import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React from 'react';
import { Text, ViewStyle } from 'react-native';

import { useButtonSmallStyles } from './button-small.styles';

interface Props {
  disabled?: boolean;
  onPress: () => void;
  title: string;
  containerStyle?: ViewStyle;
}

export function ButtonSmall({ disabled, onPress, title, containerStyle }: Props) {
  const styles = useButtonSmallStyles();

  return (
    <TouchableOpacity style={[styles.container, containerStyle]} disabled={disabled} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}
