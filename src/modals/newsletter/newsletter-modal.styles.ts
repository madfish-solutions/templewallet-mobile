import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

import { IMAGE_HEIGHT } from './constants';

export const useNewsletterModalStyles = createUseStyles(({ colors, typography }) => ({
  title: {
    ...typography.body15Semibold,
    color: colors.black,
    marginBottom: formatSize(4)
  },
  subtitle: {
    ...typography.caption13Regular,
    color: colors.gray1,
    marginBottom: formatSize(8)
  },
  imgContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: colors.orange10,
    borderRadius: formatSize(8),
    marginTop: formatSize(12),
    marginBottom: formatSize(32)
  }
}));
