import { StyleSheet } from 'react-native';

import { orange, step, white } from '../../config/styles';

export const ButtonLargePrimaryStyles = StyleSheet.create({
  containerStyle: {
    height: 6.25 * step,
    backgroundColor: orange,
    borderRadius: 1.25 * step
  },
  titleStyle: {
    color: white,
    fontSize: 2.125 * step,
    fontWeight: '600'
  }
});
