import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useTabNavigatorStyles = createUseStyles(({ colors }) => ({
  tabBar: {
    backgroundColor: colors.navigation,
    borderTopWidth: formatSize(0.5),
    borderTopColor: colors.lines
  }
}));
