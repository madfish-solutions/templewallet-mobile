import Toast from 'react-native-toast-message';

export const showErrorToast = (title: string, description?: string) =>
  Toast.show({
    type: 'error',
    text1: title,
    text2: description
  });

export const showSuccessToast = (title: string, description?: string) =>
  Toast.show({
    type: 'success',
    text1: title,
    text2: description
  });
