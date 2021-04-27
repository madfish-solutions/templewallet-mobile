import { StyleSheet } from 'react-native';

import { borderColor, step, white } from '../../config/styles';

export const DropdownStyles = StyleSheet.create({
  valueContainer: {
    padding: step,
    borderColor,
    borderRadius: step,
    borderWidth: 0.125 * step,
    backgroundColor: white
  }
});
