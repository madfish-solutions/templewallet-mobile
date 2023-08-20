import { StyleSheet } from 'react-native';

import { formatSize } from '../../../../styles/format-size';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  alertIcon: {
    marginRight: formatSize(2)
  }
});
