import { StyleSheet } from 'react-native';

export const groupStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center'
  }
});

export const itemStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5
  },
  border: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    marginTop: 10
  }
});
