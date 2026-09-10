import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTokenApyPillStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: formatSize(8),
    paddingVertical: formatSize(4),
    borderRadius: formatSize(8),
    borderWidth: formatSize(0.5),
    borderColor: colors.lines,
    backgroundColor: colors.gray4,
    gap: formatSize(4)
  },
  darkThemeContainer: {
    backgroundColor: colors.cardBG
  },
  flame: {
    width: formatSize(16),
    height: formatSize(16),
    marginVertical: formatSize(4),
    marginLeft: formatSize(4)
  },
  text: {
    ...typography.numbersMedium11,
    textTransform: 'uppercase',
    color: colors.black
  }
}));
