import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';
import { AlignItems, FlexDirection, JustifyContent } from '../../../styles/types';

export const useAccountDropdownItemStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    flexDirection: FlexDirection.Row
  },
  infoContainer: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: JustifyContent.SpaceBetween,
    marginLeft: formatSize(10)
  },
  smallInfoContainer: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: JustifyContent.Center,
    marginLeft: formatSize(4)
  },
  upperContainer: {
    flexDirection: FlexDirection.Row,
    alignItems: AlignItems.Center
  },
  upperContainerFullData: {
    justifyContent: JustifyContent.SpaceBetween
  },
  name: {
    ...typography.tagline13Tag,
    color: colors.black
  },
  lowerContainer: {
    flexDirection: FlexDirection.Row,
    justifyContent: JustifyContent.SpaceBetween,
    alignItems: AlignItems.Center
  },
  balanceText: {
    ...typography.numbersRegular13,
    color: colors.black
  }
}));
