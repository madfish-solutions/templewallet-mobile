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
  title: {
    ...typography.body15Semibold,
    color: white
  },
  balanceWrapper: {
    flexDirection: 'row'
  },
  balance: {
    marginRight: formatSize(4)
  },
  descriptionOrange: {
    ...typography.caption13Semibold,
    color: white,
    opacity: 0.8
  },
  descriptionGrey: {
    ...typography.caption13Regular,
    color: greyLight400
  }
}));
