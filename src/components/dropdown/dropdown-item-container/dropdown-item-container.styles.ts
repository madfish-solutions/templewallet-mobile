import { StyleSheet } from 'react-native';
import { black, generateShadow, orange, step, white } from '../../../config/styles';

export const DropdownItemContainerStyles = StyleSheet.create({
  root: {
    padding: step,
    backgroundColor: white,
    borderColor: white,
    borderWidth: 0.25 * step,
    borderRadius: step,
    ...generateShadow(black)
  },
  rootMargin: {
    marginVertical: 0.5 * step
  },
  rootSelected: {
    borderColor: orange
  }
});
