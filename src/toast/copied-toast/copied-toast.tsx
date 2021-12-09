import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text } from 'react-native';

import { EmptyFn } from '../../config/general';
import { ToastProviderStyles } from '../toast-provider.styles';
import { useCopiedToastStyles } from './copied-toast.styles';

interface Props {
  onPress: EmptyFn;
}

export const CopiedToast: FC<Props> = ({ onPress }) => {
  const styles = useCopiedToastStyles();

  return (
    <TouchableOpacity style={[styles.container, ToastProviderStyles.toast]} onPress={onPress}>
      <Text style={styles.text}>Copied</Text>
    </TouchableOpacity>
  );
};
