import { useMemo } from 'react';

import { ScreensOrModalsEnum } from 'src/interfaces/stacks.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';

import { ScreensEnum } from '../enums/screens.enum';
import { useNavigationState } from '../hooks/use-navigation.hook';

export const NOT_AVAILABLE_MESSAGE = 'Not available on this RPC node';

export const useSwapScreenParams = (currentRouteName: ScreensOrModalsEnum) => {
  const routes = useNavigationState(state => state.routes[0]?.state?.routes);

  return useMemo(() => {
    const route = getTokenParams(routes as RouteParams[]);

    return isDefined(route) && currentRouteName === ScreensEnum.TokenScreen
      ? { inputToken: route.params?.token }
      : undefined;
  }, [routes, currentRouteName]);
};

type RouteType = { params?: { token: TokenInterface } };
type RouteParams = { name: string } & RouteType;

const getTokenParams = (routes: RouteParams[] | undefined): null | RouteType => {
  let result = null;

  if (Array.isArray(routes) && isDefined(routes)) {
    for (const route of routes) {
      if (route.name === ScreensEnum.TokenScreen) {
        result = route;
      }
    }
  }

  return result;
};
