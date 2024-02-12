import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

export const useInternetConnectionStatusStyles = createUseStylesMemoized(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.disabled,
    paddingVertical: formatSize(8)
  },
  text: {
    ...typography.numbersRegular11,
    color: colors.black,
    lineHeight: formatTextSize(13),
    textAlign: 'center'
  }
}));
