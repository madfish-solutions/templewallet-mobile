import Toast from 'react-native-toast-message';

export const showErrorToast = (title: string, description?: string) =>
  Toast.show({
    type: 'error',
    text1: title,
    text2: description
  });
