import { StyleSheet } from 'react-native';

import { formatSize } from '../../../styles/format-size';

export const useLpTokenIconStyles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  firstIcon: {
    marginRight: formatSize(16)
  },
  secondIcon: {
    position: 'absolute',
    left: formatSize(16)
  }
});
