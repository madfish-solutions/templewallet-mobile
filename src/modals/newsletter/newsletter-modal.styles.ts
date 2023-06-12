import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

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
    justifyContent: 'center',
    alignItems: 'center'
  }
}));
