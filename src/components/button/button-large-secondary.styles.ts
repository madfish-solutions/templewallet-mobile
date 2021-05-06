import { StyleSheet } from 'react-native';

import { orange, step, white } from '../../config/styles';

export const ButtonLargeSecondaryStyles = StyleSheet.create({
  containerStyle: {
    height: 6.25 * step,
    backgroundColor: white,
    borderRadius: 1.25 * step,
    borderWidth: 0.25 * step,
    borderColor: orange
  },
  titleStyle: {
    color: orange,
    fontSize: 2.125 * step,
    fontWeight: '600'
  }
});
