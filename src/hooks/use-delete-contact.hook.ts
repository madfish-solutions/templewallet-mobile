import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { deleteContactAction } from '../store/contacts/contacts-actions';
import { Contact } from '../store/contacts/contacts-state';

export const useDeleteContactHandler = (contact: Contact) => {
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
