import { TextStyle } from 'react-native';

import { transparent } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useStyledTextInputStyles = createUseStyles(({ colors, typography }) => {
  const commonStyles: TextStyle = {
    borderRadius: formatSize(8),
    backgroundColor: colors.input,
    color: colors.black,
    borderWidth: formatSize(1),
    borderColor: transparent,
    ...typography.body15Regular
  };

  return {
    regular: {
      ...commonStyles,
      paddingVertical: formatSize(13),
      paddingLeft: formatSize(12),
      paddingRight: formatSize(40),
      minHeight: formatSize(50)
    },
    multiline: {
      ...commonStyles,
      textAlignVertical: 'top',
      paddingLeft: formatSize(12),
      paddingRight: formatSize(12),
      paddingTop: formatSize(12),
      paddingBottom: formatSize(60),
      minHeight: formatSize(200),
      maxHeight: formatSize(200)
    },
    error: {
      borderColor: colors.destructive
    },
    view: {
      position: 'relative'
    },
    cleanButton: {
      position: 'absolute',
      top: formatSize(17),
      right: formatSize(14)
    },
    passwordPadding: {
      paddingRight: formatSize(78)
    }
  };
});
