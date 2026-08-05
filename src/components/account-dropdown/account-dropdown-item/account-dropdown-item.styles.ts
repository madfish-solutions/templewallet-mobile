import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useAccountDropdownItemStyles = createUseStylesMemoized(({ colors, typography }) => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoContainer: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'space-between',
    marginLeft: formatSize(8)
  },
  infoContainerCollectibles: {
    marginLeft: formatSize(2)
  },
  upperContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  upperContainerFullData: {
    justifyContent: 'space-between',
    minHeight: formatSize(40)
  },
  name: {
    ...typography.body17Semibold,
    flexShrink: 1,
    marginRight: formatSize(4),
    color: colors.black
  },
  nameCollectibles: {
    marginRight: formatSize(10)
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
