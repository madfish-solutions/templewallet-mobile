import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useAccountDropdownItemStyles = createUseStylesMemoized(({ colors, typography }) => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rootFullData: {
    alignItems: 'flex-start',
    minHeight: formatSize(92),
    paddingHorizontal: formatSize(8),
    paddingVertical: formatSize(10)
  },
  rootModal: {
    margin: formatSize(8)
  },
  avatarContainer: {
    marginTop: formatSize(2)
  },
  infoContainer: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'space-between',
    marginLeft: formatSize(10)
  },
  smallInfoContainer: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    marginLeft: formatSize(4)
  },
  upperContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  upperContainerFullData: {
    justifyContent: 'space-between'
  },
  name: {
    ...typography.body17Semibold,
    flexShrink: 1,
    marginRight: formatSize(10),
    color: colors.black
  },
  lowerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  balanceText: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  addressesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: formatSize(10),
    marginTop: formatSize(24)
  },
  addressChip: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: formatSize(132)
  },
  addressText: {
    ...typography.numbersRegular15,
    flexShrink: 1,
    marginLeft: formatSize(4),
    color: colors.blue
  },
  accountNameMargin: {
    marginLeft: formatSize(10)
  },
  image: {
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    borderWidth: formatSize(1),
    overflow: 'hidden',
    height: formatSize(76),
    width: formatSize(76)
  }
}));

export const useAccountDropdownItemCollectiblesInfoStyles = createUseStylesMemoized(({ colors, typography }) => ({
  collectiblesData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: formatSize(5)
  },
  headerInfoColumn: {
    marginHorizontal: formatSize(8)
  },
  headerText: {
    ...typography.caption11Regular,
    color: colors.gray1,
    marginBottom: formatSize(2)
  },
  headerBoldText: {
    ...typography.numbersMedium15,
    color: colors.black
  }
}));
