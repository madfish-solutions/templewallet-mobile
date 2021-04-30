import { StyleSheet } from 'react-native';

import { step } from '../../config/styles';

export const SliderStyles = StyleSheet.create({
  slider: {
    height: step * 5
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
