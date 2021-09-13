import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useStyledRadioButtonsGroupStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    alignSelf: 'stretch',
    flex: 1
  },
  itemContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: formatSize(6)
  },
  label: {
    ...typography.body15Semibold,
    color: colors.black,
    flex: 1
  }
}));
