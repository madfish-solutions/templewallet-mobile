import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useTopUpOptionStyles = createUseStyles(({ colors, typography }) => ({
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: formatSize(48),
    padding: formatSize(8)
  },
  divider: {
    marginLeft: formatSize(16),
    marginRight: formatSize(16),
    borderBottomWidth: formatSize(0.5),
    borderColor: colors.lines
  },
  actionsContainer: {
    ...typography.caption13Semibold,
    alignItems: 'center',
    color: colors.orange,
    justifyContent: 'center'
  },
  disabled: {
    color: colors.gray1
  },
  providerLogo: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: formatSize(72)
  },
  chainbitsIcon: {
    width: formatSize(200),
    height: formatSize(40)
  }
}));
