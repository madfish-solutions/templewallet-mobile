import { black } from '../../../../config/styles';
import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';
import { generateShadow } from '../../../../styles/generate-shadow';

export const useSwapRouteItem = createUseStyles(({ colors }) => ({
  container: {
    ...generateShadow(1, black),
    padding: formatSize(8),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  lastTokenContainer: {
    marginLeft: formatSize(-4)
  }
}));
