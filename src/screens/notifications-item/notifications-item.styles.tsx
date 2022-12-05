import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const IMAGE_HEIGHT = 180;

export const useNotificationsItemStyles = createUseStyles(({ colors, typography }) => ({
  submitContainer: {
    paddingHorizontal: formatSize(16),
    paddingTop: formatSize(8),
    borderColor: colors.lines,
    borderTopWidth: formatSize(0.5)
  },
  title: {
    ...typography.body20Bold,
    color: colors.black
  },
  row: {
    flexDirection: 'row'
  },
  createdAt: {
    ...typography.tagline11Tag,
    color: colors.gray2
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: colors.orange10,
    borderRadius: formatSize(8)
  }
}));
