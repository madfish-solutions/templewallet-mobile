import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useNewsItemStyles = createUseStyles(({ colors, typography }) => ({
  contentWrapper: {
    flex: 1,
    backgroundColor: colors.white,
    padding: formatSize(18)
  },
  desctiption: {
    ...typography.caption13Regular,
    color: colors.gray1
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.blue10,
    borderRadius: formatSize(8)
  }
}));
