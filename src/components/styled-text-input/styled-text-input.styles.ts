import { StyleSheet } from 'react-native';

import { transparent } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useStyledTextInputStyles = createUseStyles(({ colors, typography }) => {
  return {
    regular: {
      ...typography.body15Regular,
      color: colors.black,
      paddingTop: formatSize(12),
      paddingBottom: formatSize(12),
      paddingLeft: formatSize(12),
      paddingRight: formatSize(40),
      borderRadius: formatSize(8),
      backgroundColor: colors.input,
      borderWidth: formatSize(1),
      borderColor: transparent,
      minHeight: formatSize(50)
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

export const StyledTextInputStyles = StyleSheet.create({
  mnemonicInput: {
    textAlignVertical: 'top',
    paddingBottom: formatSize(60),
    minHeight: formatSize(200),
    maxHeight: formatSize(200)
  },
  addressInput: {
    textAlignVertical: 'top',
    paddingTop: formatSize(16),
    paddingBottom: formatSize(16),
    minHeight: formatSize(80),
    maxHeight: formatSize(80)
  }
});
