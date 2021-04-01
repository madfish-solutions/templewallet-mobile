import { StyleSheet } from 'react-native';
import { grey, step } from '../../config/styles';

export const ScreenContainerStyles = StyleSheet.create({
  root: {
    flex: 1
  },
  header: {
    backgroundColor: grey
  },
  scrollViewContentContainer: {
    margin: step
  }
});
