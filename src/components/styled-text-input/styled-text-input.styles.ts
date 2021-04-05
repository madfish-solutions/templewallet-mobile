import { StyleSheet, TextStyle } from 'react-native';

import { generateShadow, orange, step, white } from '../../config/styles';

const lineHeight = 20;
const numberOfLines = 4;

const commonStyles: TextStyle = {
  paddingVertical: 1.5 * step,
  paddingHorizontal: 2 * step,
  borderColor: '#E2E8F0',
  borderWidth: 0.25 * step,
  borderRadius: 0.75 * step,
  backgroundColor: '#F7FAFC'
};

export const StyledTextInputStyles = StyleSheet.create({
  regular: {
    ...commonStyles
  },
  multiline: {
    ...commonStyles,
    textAlignVertical: 'top',
    minHeight: lineHeight * numberOfLines,
    maxHeight: lineHeight * numberOfLines
  },
  focus: {
    ...generateShadow(orange),
    borderColor: orange,
    backgroundColor: white
  }
});
