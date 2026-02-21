import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useSwitchStyles = createUseStyles(({ colors }) => ({
  touchableOpacity: {
    width: formatSize(48),
    height: formatSize(24),
    padding: formatSize(2),
    backgroundColor: colors.orange,
    borderRadius: formatSize(8)
  },
  toggle: {
    ...generateShadow(1, black),
    width: formatSize(24),
    height: formatSize(20),
    borderRadius: formatSize(6)
  }
}));
