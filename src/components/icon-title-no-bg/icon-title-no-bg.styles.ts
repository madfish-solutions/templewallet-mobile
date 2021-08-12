import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useIconTitleNoBgStyles = createUseStyles(({ colors, typography }) => ({
  touchableOpacity: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: formatSize(8)
  },
  text: {
    ...typography.tagline13Tag,
    color: colors.orange,
    marginLeft: formatSize(2)
  }
}));
