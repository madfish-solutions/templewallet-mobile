import { basicLightColors } from '../../styles/colors';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useTokenScreenContentContainerStyles = createUseStyles(({ colors, typography }) => ({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: formatSize(12),
    paddingHorizontal: formatSize(16),
    borderBottomWidth: formatSize(0.5),
    borderColor: colors.lines
  },
  headerText: {
    ...typography.body15Semibold,
    color: colors.gray1
  },
  delegateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: formatSize(4),
    paddingHorizontal: formatSize(8),
    borderRadius: formatSize(14),
    backgroundColor: colors.blue
  },
  delegateText: {
    ...typography.caption13Semibold,
    color: basicLightColors.white
  },
  apyText: {
    ...typography.caption13Semibold,
    color: 'white'
  }
}));
