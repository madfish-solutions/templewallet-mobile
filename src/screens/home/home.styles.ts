import { StyleSheet } from 'react-native';

import { step, white } from '../../config/styles';

export const HomeStyles = StyleSheet.create({
  accountInfo: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: step * 5
  },
  accountName: {
    color: 'black',
    fontSize: 2 * step,
    marginBottom: step * 0.5
  },
  accountKey: {
    color: 'blue',
    fontSize: 2 * step
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: step * 5
  },
  amount: {
    color: '#000000',
    fontSize: step * 3,
    marginBottom: step
  },
  formatted: {
    color: '#707070',
    fontSize: step * 1.5,
    marginBottom: step * 2
  },
  button: {
    marginRight: step,
    backgroundColor: 'rgba(255, 122, 0, 0.1)',
    color: '#FF7A00',
    textTransform: 'uppercase',
    fontSize: step * 1.8,
    paddingVertical: step,
    paddingHorizontal: step * 2
  },
  accountItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: white,
    padding: step,
    marginBottom: step,
    borderRadius: step
  }
});
