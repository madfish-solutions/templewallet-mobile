import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';
import { generateShadow } from '../../../../styles/generate-shadow';

export const useManageAccountItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    ...generateShadow(1, colors.black),
    paddingVertical: formatSize(8),
    paddingLeft: formatSize(8),
    paddingRight: formatSize(16),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG
  },
  upperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  accountContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  accountContainerData: {
    marginLeft: formatSize(10),
    justifyContent: 'space-between'
  },
  accountText: {
    ...typography.caption13Semibold,
    color: colors.black,
    marginBottom: formatSize(2)
  },
  lowerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  lowerContainerData: {
    justifyContent: 'center'
  },
  balanceText: {
    ...typography.numbersRegular15,
    color: colors.black
  }
}));
