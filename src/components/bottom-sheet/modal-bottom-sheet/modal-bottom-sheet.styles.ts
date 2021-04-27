import { StyleSheet } from 'react-native';

import { backgroundColor, step, white } from '../../../config/styles';

export const ModalBottomSheetStyles = StyleSheet.create({
  root: {
    height: '100%'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2 * step,
    paddingVertical: step,
    backgroundColor: white,
    borderTopLeftRadius: 1.25 * step,
    borderTopRightRadius: 1.25 * step
  },
  title: {
    fontSize: 2.125 * step,
    fontWeight: 'bold'
  },
  contentContainer: {
    flex: 1,
    padding: 2 * step,
    backgroundColor,
  }
});
