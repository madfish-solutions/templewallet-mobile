import { StyleSheet } from 'react-native';

export const TokenIconStyles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  hiddenImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    opacity: 0
  }
});
