import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCurrentAccountDropdownStyles = createUseStylesMemoized(({ colors, typography }) => ({
  popoverOptionContent: {
    flexDirection: 'row',
    paddingVertical: formatSize(9),
    alignItems: 'center',
    gap: formatSize(7)
  },
  popoverOptionName: {
    ...typography.body15Regular,
    color: colors.black
  }
}));
