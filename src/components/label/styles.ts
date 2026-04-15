import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useLabelStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    marginBottom: formatSize(4),
    marginHorizontal: formatSize(4)
  },
  label: {
    ...typography.body15Semibold,
    color: colors.black,
    marginBottom: formatSize(4)
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  isOptionalLabel: {
    ...typography.caption11Regular,
    color: colors.gray1
  }
}));

export const useDescriptionStyles = createUseStyles(({ colors, typography }) => ({
  description: {
    ...typography.caption13Regular,
    color: colors.gray1,
    marginBottom: formatSize(4)
  },
  boldDescriptionPiece: {
    ...typography.caption13Semibold
  }
}));
