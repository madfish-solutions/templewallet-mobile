import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useRowStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: formatSize(14),
    paddingVertical: formatSize(10),
    backgroundColor: colors.pageBG,
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(1)
  },
  coinContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: formatSize(62)
  },
  digits: {
    width: formatSize(90),
    alignItems: 'flex-end'
  },
  priceChange: {
    width: formatSize(68),
    textAlign: 'right'
  },
  regularText: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  tezValue: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  basis25: {
    flexBasis: '25%'
  }
}));
