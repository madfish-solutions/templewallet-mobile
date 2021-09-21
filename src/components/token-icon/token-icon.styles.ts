import { StyleSheet } from 'react-native';

import { formatSize } from '../../styles/format-size';

export const TokenIconStyles = StyleSheet.create({
  container: {
    marginVertical: formatSize(4),
    marginHorizontal: formatSize(4),
    borderRadius: formatSize(100),
    overflow: 'hidden'
  }
});
