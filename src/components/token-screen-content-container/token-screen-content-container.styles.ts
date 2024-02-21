import { white } from 'src/config/styles';
import { basicLightColors } from 'src/styles/colors';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

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
    color: white
  },
  scamText: {
    ...typography.tagline13Tag,
    textTransform: 'uppercase',
    color: white
  },
  scamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: formatSize(4),
    paddingRight: formatSize(8),
    borderRadius: formatSize(14),
    backgroundColor: colors.destructive
  }
}));
