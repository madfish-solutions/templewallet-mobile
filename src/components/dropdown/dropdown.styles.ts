import { StyleSheet } from 'react-native';

import { black, borderColor, generateShadow, step, white } from '../../config/styles';

export const DropdownStyles = StyleSheet.create({
  valueContainer: {
    padding: step,
    borderColor,
    borderRadius: step,
    backgroundColor: white,
    ...generateShadow(black)
  },
  listContainer: {
    marginVertical: 0.5 * step
  },
  listItemContainer: {
    marginVertical: 0.5 * step
  }
});
