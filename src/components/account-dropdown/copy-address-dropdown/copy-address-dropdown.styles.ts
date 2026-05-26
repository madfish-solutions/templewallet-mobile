import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCopyAddressDropdownStyles = createUseStylesMemoized(({ colors, typography }) => ({
  backdrop: {
    flex: 1
  },
  container: {
    position: 'absolute',
    top: formatSize(115),
    left: formatSize(16),
    width: formatSize(207),
    borderRadius: formatSize(12),
    backgroundColor: colors.pageBG,
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    overflow: 'hidden'
  },
  title: {
    ...typography.caption13Regular,
    backgroundColor: colors.cardBG,
    paddingVertical: formatSize(13),
    textAlign: 'center',
    color: colors.gray1
  },
  option: {
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: formatSize(1),
    borderColor: colors.lines
  },
  optionInfo: {
    flex: 1,
    marginRight: formatSize(16)
  },
  optionLabel: {
    ...typography.body15Semibold,
    color: colors.black,
    marginBottom: formatSize(8)
  },
  optionAddress: {
    ...typography.caption13Regular,
    width: formatSize(80),
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
