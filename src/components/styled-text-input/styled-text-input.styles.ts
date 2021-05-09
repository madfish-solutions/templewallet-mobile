import { TextStyle } from 'react-native';

import { step, transparent } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

const lineHeight = formatSize(20);
const numberOfLines = 4;

export const useStyledTextInputStyles = createUseStyles(({ colors, typography }) => {
  const commonStyles: TextStyle = {
    paddingVertical: formatSize(13),
    paddingHorizontal: formatSize(12),
    borderRadius: step,
    backgroundColor: colors.input,
    color: colors.black,
    borderWidth: formatSize(1),
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
