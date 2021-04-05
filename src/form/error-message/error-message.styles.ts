import { StyleSheet } from 'react-native';
import { step, red, transparent } from '../../config/styles';

export const ErrorMessageStyles = StyleSheet.create({
  root: {
    color: transparent,
    fontSize: 1.5 * step,
    lineHeight: 1.5 * step,
    marginTop: 0.5 * step,
    alignSelf: 'flex-end'
  },
  rootVisible: {
    color: red
  }
});
