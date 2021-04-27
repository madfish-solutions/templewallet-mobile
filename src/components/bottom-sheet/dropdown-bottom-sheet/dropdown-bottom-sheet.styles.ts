import { StyleSheet } from 'react-native';

import { borderColor, pageBgColor, step, white } from '../../../config/styles';

export const DropdownBottomSheetStyles = StyleSheet.create({
  root: {
    height: '100%',
    marginHorizontal: step
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1.5 * step,
    backgroundColor: white,
    borderTopLeftRadius: 1.25 * step,
    borderTopRightRadius: 1.25 * step,
    borderBottomColor: borderColor,
    borderBottomWidth: 0.5
  },
  title: {
    fontSize: 1.625 * step
  },
  contentContainer: {
    flex: 1,
    padding: step,
    backgroundColor: pageBgColor
  },
  footerContainer: {
    marginBottom: 4.375 * step,
    padding: 1.5 * step,
    backgroundColor: white,
    borderBottomLeftRadius: 1.25 * step,
    borderBottomRightRadius: 1.25 * step
  }
});
