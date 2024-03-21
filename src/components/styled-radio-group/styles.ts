import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useStyledRadioButtonsGroupStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    alignSelf: 'stretch',
    flex: 1
  },
  itemContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    width: '100%',
    height: formatSize(44)
  },
  label: {
    ...typography.body15Semibold,
    color: colors.black,
    flex: 1
  },
  disabledLabel: {
    ...typography.body15Semibold,
    color: colors.disabled,
    flex: 1
  }
}));
