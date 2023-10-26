import { basicLightColors } from 'src/styles/colors';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { hexa } from 'src/utils/style.util';

import { GRID_GAP } from '../styles';

export const useCollectibleItemStyles = createUseStylesMemoized(({ colors, typography }) => ({
  root: {
    backgroundColor: colors.cardBG,
    borderRadius: formatSize(4),
    marginBottom: GRID_GAP
  },
  image: {
    backgroundColor: colors.blue10,
    borderRadius: formatSize(4)
  },
  description: {
    paddingHorizontal: formatSize(4),
    paddingTop: formatSize(4),
    paddingBottom: formatSize(6)
  },
  name: {
    marginBottom: formatSize(2),
    ...typography.caption13Regular,
    color: colors.black
  },
  price: {
    ...typography.numbersRegular11,
    color: colors.gray1
  }
}));

export const useBalanceStyles = createUseStylesMemoized(({ typography }) => ({
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
