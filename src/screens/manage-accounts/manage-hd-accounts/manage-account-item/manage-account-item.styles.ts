/* eslint sonarjs/no-duplicate-string: 0 */
import { black } from '../../../../config/styles';
import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';
import { generateShadow } from '../../../../styles/generate-shadow';

export const useManageAccountItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    ...generateShadow(1, black),
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
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  accountContainerData: {
    flexShrink: 1,
    marginLeft: formatSize(10),
    justifyContent: 'space-between'
  },
  accountText: {
    ...typography.caption13Semibold,
    color: colors.black,
    marginBottom: formatSize(2)
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  lowerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  lowerContainerData: {
    justifyContent: 'space-between'
  },
  balanceText: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  equityText: {
    ...typography.numbersRegular11,
    color: colors.gray1
  }
}));
