import { StyleSheet } from 'react-native';

import { formatSize } from '../../../../styles/format-size';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  even: {
    marginRight: formatSize(8)
  }
});
