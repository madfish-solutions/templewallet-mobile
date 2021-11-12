import { StyleSheet } from 'react-native';

import { formatSize } from '../../../styles/format-size';

export const LpTokenIconStyles = StyleSheet.create({
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
