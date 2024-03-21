import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { shouldShowNewsletterModalAction } from 'src/store/newsletter/newsletter-actions';
import { setStartModalAllowedAction } from 'src/store/settings/settings-actions';

const navigationStateFallback = { routes: [], index: 0 };

export const NewsletterModalTracker = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { routes, index } = navigation.getState() ?? navigationStateFallback;
  const routeName = routes[index]?.name ?? '';
  const prevRouteNameRef = useRef('');

  useEffect(() => {
    if (routeName !== ModalsEnum.Newsletter && prevRouteNameRef.current === ModalsEnum.Newsletter) {
      dispatch(setStartModalAllowedAction(true));
      dispatch(shouldShowNewsletterModalAction(false));
    }
    prevRouteNameRef.current = routeName;
  }, [dispatch, routeName]);

  return null;
};
