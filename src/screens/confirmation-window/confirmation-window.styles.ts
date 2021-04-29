import { StyleSheet } from 'react-native';

import { zIndexEnum } from '../../enums/z-index.enum';

export const ConfirmationWindowStyles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: zIndexEnum.ConfirmationWindow,
    backgroundColor: 'red'
  }
});
