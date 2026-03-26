import { StyleSheet } from 'react-native';

import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const fixedStyles = StyleSheet.create({
  fill: { flex: 1 },
  hidden: { position: 'absolute', opacity: 0, width: 0, height: 0, overflow: 'hidden' }
});

export const useSaplingOperationsConfirmationStyles = createUseStyles(({ colors, typography }) => ({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: formatSize(24),
    gap: formatSize(24)
  },
  loaderText: {
    ...typography.caption11Regular,
    color: colors.gray1,
    textAlign: 'center'
  },
  promotionContainer: {
    paddingBottom: formatSize(16)
  }
}));
