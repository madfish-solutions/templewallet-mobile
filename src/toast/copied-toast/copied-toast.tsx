import React, { FC } from 'react';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
