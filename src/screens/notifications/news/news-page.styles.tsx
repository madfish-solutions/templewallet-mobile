import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useNewsPageStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(20)
  },
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
    ...typography.body15Regular,
    color: colors.black
  },
  detailsContainer: {
    flexDirection: 'row'
  },
  createdAt: {
    ...typography.tagline11Tag,
    color: colors.gray2
  },
  imageWrapper: {
    height: formatSize(192),
    width: '100%',
    paddingHorizontal: formatSize(16),
    paddingTop: formatSize(12)
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.blue10,
    borderRadius: formatSize(8)
  }
}));
