import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useEditContactModalStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    marginTop: formatSize(16)
  },
  deleteButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(4),
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(10)
  },
  deleteButtonText: {
    ...typography.caption13Semibold,
    color: colors.destructive
  }
}));
