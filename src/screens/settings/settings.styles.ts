import { StyleSheet } from 'react-native';

import { step, white } from '../../config/styles';

export const SettingsStyles = StyleSheet.create({
  description: {
    fontSize: step,
    marginBottom: 2 * step
  },
  accountItem: {
    backgroundColor: white,
    padding: step,
    marginBottom: step,
    borderRadius: step
  }
});
