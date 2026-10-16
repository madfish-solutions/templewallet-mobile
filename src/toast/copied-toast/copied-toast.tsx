import React, { FC } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { useCopiedToastStyles } from './copied-toast.styles';

interface Props {
  onPress: EmptyFn;
}

export const CopiedToast: FC<Props> = ({ onPress }) => {
  const styles = useCopiedToastStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>Copied</Text>
    </TouchableOpacity>
  );
};
