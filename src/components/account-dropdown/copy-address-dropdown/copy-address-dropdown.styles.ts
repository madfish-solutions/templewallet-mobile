import { Platform } from 'react-native';

import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCopyAddressDropdownStyles = createUseStylesMemoized(({ colors, typography }) => ({
  backdrop: {
    flex: 1
  },
  container: {
    position: 'absolute',
    top: formatSize(108),
    left: formatSize(28),
    width: formatSize(333),
    borderRadius: formatSize(16),
    backgroundColor: colors.cardBG,
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOpacity: 0.14,
        shadowRadius: formatSize(18),
        shadowOffset: { width: 0, height: formatSize(8) }
      },
      android: {
        elevation: 12
      }
    })
  },
  title: {
    ...typography.caption13Regular,
    color: colors.gray1,
    textAlign: 'center',
    paddingVertical: formatSize(20)
  },
  option: {
    minHeight: formatSize(92),
    paddingHorizontal: formatSize(26),
    paddingVertical: formatSize(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  optionInfo: {
    flex: 1,
    marginRight: formatSize(16)
  },
  optionLabel: {
    ...typography.tagline13Tag,
    color: colors.black,
    marginBottom: formatSize(8)
  },
  optionAddress: {
    ...typography.caption13Regular,
    color: colors.blue
  },
  iconContainer: {
    width: formatSize(32),
    height: formatSize(32),
    borderRadius: formatSize(16),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray4
  }
}));
