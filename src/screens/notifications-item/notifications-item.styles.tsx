import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useNotificationsItemsStyles = createUseStyles(({ colors, typography }) => ({
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
  description: {
    ...typography.caption13Regular,
    color: colors.black
  },
  link: {
    ...typography.caption13Regular
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
    height: formatSize(192),
    backgroundColor: colors.blue10,
    borderRadius: formatSize(8)
  }
}));
