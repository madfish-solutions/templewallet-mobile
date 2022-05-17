import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';
import { generateShadow } from '../../../../styles/generate-shadow';

export const useSwapRouteItem = createUseStyles(({ colors }) => ({
  container: {
    ...generateShadow(1, colors.black),
    padding: formatSize(8),
    borderRadius: formatSize(10),
    borderColor: colors.gray1,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  lastTokenContainer: {
    marginLeft: formatSize(-4)
  }
}));
