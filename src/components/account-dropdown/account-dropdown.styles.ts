import { StyleSheet } from 'react-native';

import { blue, borderColor, orange, step } from '../../config/styles';
import { hexa } from '../../utils/style.util';

export const AccountDropdownValueStyles = StyleSheet.create({
  root: {
    flexDirection: 'row'
  },
  icon: {
    width: 5.5 * step,
    height: 5.5 * step,
    backgroundColor: orange,
    borderColor,
    borderRadius: step,
    borderWidth: 0.125 * step
  },
  infoContainer: {
    marginLeft: step,
    justifyContent: 'space-between'
  },
  name: {
    fontWeight: 'bold'
  },
  publicKeyHash: {
    color: blue,
    paddingHorizontal: step,
    paddingVertical: 0.25 * step,
    backgroundColor: hexa(blue, 0.1),
    borderRadius: 0.5 * step
  }
});
