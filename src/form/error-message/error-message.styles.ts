import { StyleSheet } from 'react-native';

import { red, transparent } from '../../config/styles';
import { formatSize } from '../../styles/format-size';

export const ErrorMessageStyles = StyleSheet.create({
  root: {
    color: transparent,
    fontSize: formatSize(11),
    lineHeight: formatSize(13),
    marginVertical: formatSize(6),
    marginLeft: formatSize(6),
    alignSelf: 'flex-start'
  },
  rootVisible: {
    color: red
  }
});
