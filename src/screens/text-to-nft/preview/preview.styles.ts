import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const usePreviewStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    flex: 1,
    marginTop: formatSize(24),
    paddingHorizontal: formatSize(16)
  },
  borderRadius: {
    borderRadius: formatSize(10)
  },
  image: {
    borderWidth: formatSize(2),
    borderColor: 'transparent'
  },
  marginBottom: {
    marginBottom: formatSize(16)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  imageContainer: {
    alignItems: 'center'
  },
  active: {
    borderWidth: formatSize(2),
    borderColor: colors.orange
  },
  text: {
    marginTop: formatSize(4),
    ...typography.caption13Regular
  },
  activeText: {
    color: colors.orange,
    ...typography.caption13Semibold
  }
}));
