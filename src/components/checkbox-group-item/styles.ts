import { StyleSheet } from 'react-native';

import { formatSize } from 'src/styles/format-size';

export const CheckboxGroupItemStyles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: formatSize(12),
    marginRight: formatSize(12)
  }
});
