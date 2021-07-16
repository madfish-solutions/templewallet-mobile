import { black } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

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
