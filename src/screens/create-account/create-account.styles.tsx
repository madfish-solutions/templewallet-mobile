import { StyleSheet } from 'react-native';

import { formatSize } from '../../styles/format-size';

export const CreateAccountStyles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    paddingLeft: formatSize(5),
    marginBottom: formatSize(6)
  }
});
