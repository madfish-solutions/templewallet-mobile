import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { Contact } from 'src/interfaces/contact.interface';
import { deleteContactAction } from 'src/store/contact-book/contact-book-actions';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

enum DeleteContactAnalyticsEvents {
  Cancel = 'DELETE_CONTACT_CANCEL',
  Success = 'DELETE_CONTACT_SUCCESS'
}

export const useDeleteContact = (onDeleted?: EmptyFn) => {
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();

  return useCallback(
    (contact: Contact) =>
      Alert.alert(`Delete “${contact.name}” from Contacts?`, undefined, [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => trackEvent(DeleteContactAnalyticsEvents.Cancel, AnalyticsEventCategory.General)
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteContactAction(contact));
            trackEvent(DeleteContactAnalyticsEvents.Success, AnalyticsEventCategory.General);
            onDeleted?.();
          }
        }
      ]),
    [dispatch, onDeleted, trackEvent]
  );
};
