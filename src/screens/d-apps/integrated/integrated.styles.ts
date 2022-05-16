import { greyLight400, white } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useIntegratedDAppStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: formatSize(10),
    paddingHorizontal: formatSize(24),
    paddingVertical: formatSize(20),
    backgroundColor: colors.orange
  },
  kolibriContainer: {
    backgroundColor: colors.kolibriGreen
  },
  title: {
    ...typography.body15Semibold,
    color: white
  },
  description: {
    ...typography.caption11Regular,
    maxWidth: '100%',
    color: greyLight400
  }
}));
