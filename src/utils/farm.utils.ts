import { Alert } from 'react-native';

export const doAfterConfirmation = (description: string, actionName: string, onConfirm: () => void) =>
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
