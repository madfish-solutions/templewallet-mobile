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
    marginTop: 2 * step
  },
  title: {
    fontSize: 4 * step,
    color: grey,
    fontWeight: 'bold'
  },
  description: {
    fontSize: 2 * step,
    color: grey,
    marginTop: 2 * step
  }
});
