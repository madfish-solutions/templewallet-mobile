import React, { FC } from 'react';
import { Text } from 'react-native';

import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';

import { useCopiedToastStyles } from './copied-toast.styles';

interface Props {
  onPress: EmptyFn;
}

export const CopiedToast: FC<Props> = ({ onPress }) => {
  const styles = useCopiedToastStyles();

  return (
    <SafeTouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>Copied</Text>
    </SafeTouchableOpacity>
  );
};
