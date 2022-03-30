import { black } from '../../../../config/styles';
import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';
import { generateShadow } from '../../../../styles/generate-shadow';
import { AlignItems, FlexDirection, JustifyContent } from '../../../../styles/types';

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
    flexDirection: FlexDirection.Row,
    justifyContent: JustifyContent.SpaceBetween,
    alignItems: AlignItems.Center
  },
  accountContainer: {
    flexShrink: 1,
    flexDirection: FlexDirection.Row,
    alignItems: AlignItems.Center
  },
  accountContainerData: {
    flexShrink: 1,
    marginLeft: formatSize(10),
    justifyContent: JustifyContent.SpaceBetween
  },
  accountText: {
    ...typography.caption13Semibold,
    color: colors.black,
    marginBottom: formatSize(2)
  },
  actionsContainer: {
    flexDirection: FlexDirection.Row,
    alignItems: AlignItems.Center
  },
  lowerContainer: {
    flexDirection: FlexDirection.Row,
    justifyContent: JustifyContent.SpaceBetween
  },
  lowerContainerData: {
    justifyContent: JustifyContent.SpaceBetween
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
