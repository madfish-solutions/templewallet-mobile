import { StyleSheet } from 'react-native';

export const StaticTokenIconStyles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative'
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
