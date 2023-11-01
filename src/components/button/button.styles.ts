import { StyleSheet } from 'react-native';

export const ButtonStyles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  touchableOpacity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center'
  }
});
