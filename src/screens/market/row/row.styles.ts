import { formatSize } from '../../../styles/format-size';
import { createUseStyles } from './../../../styles/create-use-styles';

export const useRowStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: formatSize(14),
    paddingVertical: formatSize(10)
  },
  coinContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: formatSize(58)
  },
  digits: {
    width: formatSize(100),
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
  }
}));
