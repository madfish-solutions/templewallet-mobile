import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useHopItemStyles = createUseStyles(({ colors }) => ({
  container: {
    ...generateShadow(1, black),
    padding: formatSize(6),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  lastTokenContainer: {
    marginLeft: formatSize(-8)
  }
}));
