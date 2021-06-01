import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useTokenListItemStyles = createUseStyles(({ colors, typography }) => ({
  rootContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: formatSize(12),
    borderBottomWidth: formatSize(0.5),
    borderColor: colors.lines
  },
  leftContainer: {
    flexDirection: 'row'
  },
  infoContainer: {
    justifyContent: 'center',
    marginLeft: formatSize(8)
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  symbolText: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  apyContainer: {
    backgroundColor: colors.blue,
    borderRadius: formatSize(8),
    paddingHorizontal: formatSize(4),
    paddingVertical: formatSize(2),
    marginLeft: formatSize(4)
  },
  apyText: {
    ...typography.tagline11Tag,
    color: colors.white
  },
  nameText: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  balanceText: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  valueText: {
    ...typography.numbersRegular11,
    color: colors.gray1
  }
}));
