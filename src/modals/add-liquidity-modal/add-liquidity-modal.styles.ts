import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useAddLiquidityModalStyles = createUseStyles(({ colors, typography }) => ({
  sectionNameText: {
    ...typography.body15Semibold,
    color: colors.black,
    marginTop: formatSize(20),
    marginBottom: formatSize(13)
  },
  lineDivider: {
    width: '100%',
    borderBottomWidth: formatSize(0.5),
    borderColor: colors.lines
  },
  detailsItemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: formatSize(12)
  },
  detailsDescription: {
    ...typography.caption11Regular,
    color: colors.gray1
  },
  detailsValue: {
    ...typography.numbersMedium13,
    color: colors.black
  },
  approxEqual: {
    ...typography.numbersMedium13,
    color: colors.gray2
  },
  iconCentered: {
    justifyContent: 'center',
    alignItems: 'center'
  }
}));
