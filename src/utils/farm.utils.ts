import { Alert } from 'react-native';

import { EmptyFn } from 'src/config/general';

export const doAfterConfirmation = (description: string, actionName: string, onConfirm: EmptyFn) =>
  Alert.alert('Are you sure?', description, [
    {
      text: actionName,
      style: 'destructive',
      onPress: onConfirm
    },
    {
      text: 'Cancel',
      style: 'cancel'
    }
  ]);
