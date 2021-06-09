import Toast from 'react-native-toast-message';

import { ToastTypeEnum } from '../enums/toast-type.enum';

export const showErrorToast = (title: string, description?: string) =>
  Toast.show({
    type: ToastTypeEnum.Error,
    text1: title,
    text2: description
  });

export const showSuccessToast = (title: string, description?: string) =>
  Toast.show({
    type: ToastTypeEnum.Success,
    text1: title,
    text2: description
  });

export const showCopiedToast = () => Toast.show({ type: ToastTypeEnum.Copied });
