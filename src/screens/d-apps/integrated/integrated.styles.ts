import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useIntegratedDAppStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: formatSize(10),
    paddingHorizontal: formatSize(24),
    paddingVertical: formatSize(20),
    backgroundColor: colors.accentBG
  },
  title: {
    ...typography.body15Semibold,
    color: '#ffffff'
  },
  description: {
    ...typography.caption11Regular,
    color: '#F4F4F4'
  }
}));
