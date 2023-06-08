import { StyleSheet } from 'react-native';

import { red, transparent } from '../../config/styles';
import { formatSize, formatTextSize } from '../../styles/format-size';

export const ErrorMessageStyles = StyleSheet.create({
  root: {
    color: transparent,
    fontSize: formatTextSize(11),
    lineHeight: formatTextSize(13),
    marginVertical: formatSize(6),
    marginLeft: formatSize(6),
    alignSelf: 'flex-start'
  },
  rootVisible: {
    color: red
  }
});
