import { StyleSheet } from 'react-native';

import { borderColor, pageBgColor, step, white } from '../../../config/styles';

export const closeIconSize = 3.5 * step;

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
    borderTopRightRadius: 1.25 * step,
    borderBottomColor: borderColor,
    borderBottomWidth: 0.5
  },
  iconSubstitute: {
    width: closeIconSize,
    height: closeIconSize
  },
  title: {
    fontSize: 2.125 * step,
    fontWeight: 'bold'
  },
  contentContainer: {
    flex: 1,
    padding: step,
    backgroundColor: pageBgColor
  }
});
