import { StyleSheet } from 'react-native';

import { zIndexesEnum } from '../../config/styles';

export const ConfirmationWindowStyles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: zIndexesEnum.Overlay,
    backgroundColor: 'red'
  }
});
