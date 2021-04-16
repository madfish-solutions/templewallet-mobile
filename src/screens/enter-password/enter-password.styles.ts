import { StyleSheet } from 'react-native';

import { white, zIndexesEnum } from '../../config/styles';

export const EnterPasswordStyles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: zIndexesEnum.Modal,
    backgroundColor: white
  }
});
