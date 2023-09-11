import { createUseStyles } from '../../../../../styles/create-use-styles';
import { formatSize } from '../../../../../styles/format-size';

export const useEnterPromptStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: formatSize(12)
  },
  title: {
    ...typography.body15Semibold,
    color: colors.black
  },
  counter: {
    ...typography.caption13Regular,
    color: colors.gray2
  }
}));
