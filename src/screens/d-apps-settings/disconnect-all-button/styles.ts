import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useDisconnectAllButtonStyles = createUseStylesMemoized(({ colors, typography }) => ({
  root: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: formatSize(4),
    height: formatSize(38),
    paddingHorizontal: formatSize(16)
  },
  text: {
    ...typography.tagline13Tag,
    lineHeight: formatSize(18),
    color: colors.destructive
  }
}));
