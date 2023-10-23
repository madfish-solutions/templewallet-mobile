import { StyleSheet } from 'react-native';

import { formatSize } from 'src/styles/format-size';

export const ButtonStyles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexBasis: formatSize(50),
    flexGrow: 1
  },
  touchableOpacity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
