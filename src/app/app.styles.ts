import { StyleSheet } from 'react-native';
import { grey, primaryWhite, step } from '../config/styles';

export const AppStyles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: primaryWhite
  },
  scrollView: {
    alignItems: 'center'
  },
  logo: {
    marginTop: 10 * step
  },
  title: {
    fontSize: 4 * step,
    color: grey,
    fontWeight: 'bold',
    marginTop: 2 * step
  },
  description: {
    fontSize: 2 * step,
    color: grey,
    marginTop: 2 * step
  }
});
