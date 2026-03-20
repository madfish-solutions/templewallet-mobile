import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTezosInfoStyles = createUseStyles(({ colors, typography }) => ({
  topContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between'
  },
  displayFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  tooltipContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  flex1: {
    flex: 1
  },
  commonView: {
    padding: formatSize(8),
    borderRadius: formatSize(10),
    borderWidth: formatSize(1),
    borderColor: colors.lines
  },
  tezMain: {
    justifyContent: 'space-between',
    padding: formatSize(4),
    paddingBottom: formatSize(12),
    borderBottomWidth: formatSize(1),
    borderBottomColor: colors.lines
  },
  percentage: {
    paddingBottom: formatSize(3),
    marginBottom: formatSize(2),
    borderBottomWidth: formatSize(1),
    borderBottomColor: colors.lines
  },
  imageAndPrice: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  displayCenter: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  tezosPrice: {
    ...typography.numbersRegular22,
    color: colors.black
  },
  regularText: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  subtitle13: {
    ...typography.numbersRegular13,
    color: colors.gray1
  },
  subtitle11: {
    ...typography.numbersRegular11,
    color: colors.gray1,
    textAlign: 'center'
  },
  nameAndSymbolContainer: {
    marginLeft: formatSize(8)
  },
  mr8: {
    marginRight: formatSize(8)
  },
  mb8: {
    marginBottom: formatSize(8)
  }
}));
