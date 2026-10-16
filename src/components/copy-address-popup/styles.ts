import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCopyAddressPopupStyles = createUseStylesMemoized(({ colors, typography }) => ({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  optionInfo: {
    flex: 1,
    marginRight: formatSize(16)
  },
  optionLabel: {
    ...typography.body15Semibold,
    color: colors.black
  },
  optionAddress: {
    ...typography.caption13Regular,
    width: formatSize(80),
    paddingVertical: formatSize(2),
    color: colors.blue
  },
  iconContainer: {
    width: formatSize(24),
    height: formatSize(24),
    borderRadius: formatSize(100),
    borderWidth: formatSize(1),
    borderColor: colors.gray4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBG
  }
}));
