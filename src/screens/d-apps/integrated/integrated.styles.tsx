import { greyLight400, white } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useIntegratedDAppStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: formatSize(10),
    marginHorizontal: formatSize(16),
    paddingHorizontal: formatSize(24),
    paddingVertical: formatSize(20),
    backgroundColor: colors.kolibriGreen
  },
  title: {
    ...typography.body15Semibold,
    color: white
  },
  description: {
    ...typography.caption11Regular,
    color: greyLight400
  }
}));
