import { DEFAULT_BORDER_WIDTH } from '../config/styles';

import { createUseStyles } from './create-use-styles';
import { formatSize } from './format-size';

export const useSetPasswordScreensCommonStyles = createUseStyles(({ colors, typography }) => ({
  marginTopAuto: {
    marginTop: 'auto'
  },
  fixedButtonContainer: {
    borderTopWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines,
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    paddingHorizontal: formatSize(16),
    backgroundColor: colors.pageBG
  },
  withoutSeparator: {
    borderTopWidth: 0
  },
  checkboxContainer: {
    marginLeft: formatSize(4)
  },
  removeMargin: {
    marginBottom: formatSize(-20)
  },
  checkboxText: {
    ...typography.body15Semibold,
    color: colors.black
  },
  buttonsContainer: {
    paddingHorizontal: formatSize(8)
  },
  flex: {
    flex: 1
  },
  checkboxWithTooltipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: formatSize(12),
    marginRight: formatSize(12)
  },
  buttonsFloatingContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingHorizontal: formatSize(16)
  }
}));
