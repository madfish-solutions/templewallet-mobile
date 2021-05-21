import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useStyledRadioButtonsGroupStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    alignSelf: 'flex-start'
  },
  itemContainer: {
    paddingVertical: formatSize(6)
  },
  label: {
    ...typography.body15Semibold,
    color: colors.black
  }
}));
