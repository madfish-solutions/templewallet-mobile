import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { setShouldRedirectToNotificationsAction } from 'src/store/notifications/notifications-actions';
import { useShouldRedirectToNotificationsSelector } from 'src/store/notifications/notifications-selectors';

export const useNotificationRedirection = (isLocked: boolean, isAuthorised: boolean) => {
  const navigateToScreen = useNavigateToScreen();
  const dispatch = useDispatch();
  const shouldRedirectToNotifications = useShouldRedirectToNotificationsSelector();

  useEffect(() => {
    if (isLocked || !isAuthorised || !shouldRedirectToNotifications) {
      return;
    }

    dispatch(setShouldRedirectToNotificationsAction(false));
    navigateToScreen({ screen: ScreensEnum.Notifications });
  }, [dispatch, isAuthorised, isLocked, navigateToScreen, shouldRedirectToNotifications]);
};
