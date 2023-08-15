import { basicLightColors } from '../../../../styles/colors';
import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';
import { hexa } from '../../../../utils/style.util';

export const useBalanceStyles = createUseStyles(({ typography }) => ({
  root: {
    position: 'absolute',
    bottom: formatSize(4),
    left: formatSize(4),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: formatSize(4),
    paddingVertical: formatSize(2),
    backgroundColor: hexa(basicLightColors.black, 0.9),
    borderRadius: formatSize(4)
  },
  text: {
    ...typography.numbersRegular11,
    color: basicLightColors.white
  }
}));
