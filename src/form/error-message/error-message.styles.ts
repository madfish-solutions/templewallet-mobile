import { StyleSheet } from 'react-native';

import { red, transparent } from '../../config/styles';
import { formatSize } from '../../styles/format-size';

export const ErrorMessageStyles = StyleSheet.create({
  root: {
    color: transparent,
    fontSize: formatSize(12),
    lineHeight: formatSize(12),
    marginTop: formatSize(4),
    alignSelf: 'flex-start'
  },
  rootVisible: {
    color: red
  }
});
