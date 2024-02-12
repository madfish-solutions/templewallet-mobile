import { white } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatTextSize } from 'src/styles/format-size';

export const useInternetConnectionStatusStyles = createUseStylesMemoized(({ colors, typography }) => ({
  container: {
    backgroundColor: colors.destructive
  },
  text: {
    ...typography.body15Semibold,
    color: white,
    lineHeight: formatTextSize(20),
    textAlign: 'center'
  }
}));
