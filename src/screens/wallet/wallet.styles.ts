import { StyleSheet } from 'react-native';

import { black, blue, darkOrange, greyLight, orangeLight, step, white } from '../../config/styles';

export const WalletStyles = StyleSheet.create({
  accountInfo: {
    marginBottom: step * 5
  },
  accountName: {
    color: black,
    fontSize: 2 * step,
    marginBottom: step * 0.5
  },
  accountKey: {
    color: blue,
    fontSize: 2 * step
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: step * 5
  },
  amount: {
    color: black,
    fontSize: step * 3,
    marginBottom: step
  },
  formatted: {
    color: greyLight,
    fontSize: step * 1.5,
    marginBottom: step * 2
  },
  button: {
    marginRight: step,
    backgroundColor: darkOrange,
    color: orangeLight,
    textTransform: 'uppercase',
    fontSize: step * 1.8,
    paddingVertical: step,
    paddingHorizontal: step * 2
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: white,
    padding: step,
    marginBottom: step,
    borderRadius: step
  }
});
