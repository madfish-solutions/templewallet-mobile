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
    paddingRight: formatSize(40),
    borderRadius: step,
    backgroundColor: transparent,
    color: colors.black,
    borderWidth: formatSize(1),
    borderColor: transparent,
    minHeight: formatSize(50),
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
    },
    view: {
      position: 'relative'
    },
    cleanButton: {
      position: 'absolute',
      top: formatSize(13),
      right: formatSize(12)
    },
    passwordFontSize: {
      ...typography.caption11Regular
    },
    passwordPadding: {
      paddingRight: formatSize(78)
    }
  };
});
