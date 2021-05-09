import { TextStyle } from 'react-native';

import { step, transparent } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';

const lineHeight = 20;
const numberOfLines = 4;

export const useStyledTextInputStyles = createUseStyles(({ colors, typography }) => {
  const commonStyles: TextStyle = {
    paddingVertical: 1.625 * step,
    paddingHorizontal: 1.5 * step,
    borderRadius: step,
    backgroundColor: colors.input,
    color: colors.black,
    borderWidth: step * 0.125,
    borderColor: transparent,
    ...typography.body17Regular
  };
  return {
    regular: {
      ...commonStyles
    },
    multiline: {
      ...commonStyles,
      textAlignVertical: 'top',
      minHeight: lineHeight * numberOfLines,
      maxHeight: lineHeight * numberOfLines
    },
    error: {
      borderColor: colors.destructive
    }
  };
});
