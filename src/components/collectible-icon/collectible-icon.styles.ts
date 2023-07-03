import { StyleSheet } from 'react-native';

import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

import { basicLightColors } from '../../styles/colors';
import { hexa } from '../../utils/style.util';

export const useCollectibleIconStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    borderRadius: formatSize(4),
    overflow: 'hidden'
  },
  image: {
    backgroundColor: colors.blue10,
    borderRadius: formatSize(4)
  },
  balanceContainer: {
    position: 'absolute',
    bottom: formatSize(4),
    left: formatSize(4),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: formatSize(4),
    paddingVertical: formatSize(2),
    backgroundColor: hexa(basicLightColors.black, 0.99),
    borderRadius: formatSize(4)
  },
  balanceText: {
    ...typography.numbersRegular11,
    color: basicLightColors.white
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center'
  }
}));
