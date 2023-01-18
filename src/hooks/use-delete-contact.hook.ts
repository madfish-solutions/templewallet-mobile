import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { IAccountBase } from '../interfaces/account.interface';
import { deleteContactAction } from '../store/contacts/contacts-actions';

export const useDeleteContactHandler = (contact: IAccountBase) => {
  const dispatch = useDispatch();

  return () =>
    Alert.alert(`Delete “${contact.name}” from Contacts?`, undefined, [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteContactAction(contact))
      }
    ]);
};
