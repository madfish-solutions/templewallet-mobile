import { StyleSheet } from 'react-native';

import { zIndexEnum } from '../../enums/z-index.enum';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useLoaderStyles = createUseStyles(({ colors }) => ({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: zIndexEnum.Toast,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black16
  },
  card: {
    width: formatSize(80),
    height: formatSize(80),
    borderRadius: formatSize(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardBG
  },
  container: {
    position: 'relative',
    flexDirection: 'column-reverse'
  },
  icon: {
    position: 'absolute',
    top: formatSize(0),
    left: formatSize(0)
  }
}));
