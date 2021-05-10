import { step } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const closeIconSize = 3.5 * step;

export const useModalBottomSheetStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    height: '100%'
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2.75 * step,
    paddingBottom: step,
    paddingHorizontal: 2 * step,
    backgroundColor: colors.cardBG,
    borderTopLeftRadius: 1.25 * step,
    borderTopRightRadius: 1.25 * step,
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(0.5)
  },
  iconSubstitute: {
    width: closeIconSize,
    height: closeIconSize
  },
  title: {
    ...typography.body17Semibold,
    color: colors.black
  },
  contentContainer: {
    flex: 1,
    paddingVertical: step,
    paddingHorizontal: 2 * step,
    backgroundColor: colors.pageBG
  }
}));
