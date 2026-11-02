import { useMemo } from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { ScreensOrModalsEnum } from 'src/interfaces/stacks.interface';
import type { TokenScreenDescriptor } from 'src/screens/token-screen/token-screen-descriptor';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { useTezosAccountTokens } from 'src/utils/assets/hooks';
import { isDefined } from 'src/utils/is-defined';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { ScreensEnum, ScreensParamList } from '../enums/screens.enum';
import { useNavigationState } from '../hooks/use-navigation.hook';

export const NOT_AVAILABLE_MESSAGE = 'Select an account with a Tezos or Etherlink address for swaps.';

export const useCanSwapOnEtherlink = (): boolean => {
  const address = useAccountAddressForEvm();
  const chain = useEvmChain(ETHERLINK_MAINNET_CHAIN_ID);

  return Boolean(address && chain && !chain.disabled && !chain.disabledAutomatically);
};

type RouteType = { params?: { descriptor: TokenScreenDescriptor } };
type RouteParams = { name: string } & RouteType;

export const useIsManageCollectiblesTab = (currentRouteName: ScreensOrModalsEnum) => {
  const route = useNavigationState(state =>
    state.routes[0]?.state?.routes?.find(route => route.name === ScreensEnum.ManageAssets)
  );

  return currentRouteName === ScreensEnum.ManageAssets && isManageAssetsRoute(route) && route.params.collectibles;
};

export const useSwapScreenParams = (currentRouteName: ScreensOrModalsEnum) => {
  const routes = useNavigationState(state => state.routes[0]?.state?.routes);
  const tokens = useTezosAccountTokens();

  return useMemo<ScreensParamList[ScreensEnum.SwapScreen]>(() => {
    const route = getTokenParams(routes as RouteParams[]);
    const descriptor = route?.params?.descriptor;

    if (!isDefined(descriptor) || currentRouteName !== ScreensEnum.TokenScreen) {
      return undefined;
    }

    if (descriptor.chainKind === TempleChainKind.EVM) {
      return descriptor.chainId === ETHERLINK_MAINNET_CHAIN_ID
        ? { chainKind: TempleChainKind.EVM, chainId: descriptor.chainId, inputAsset: descriptor }
        : undefined;
    }

    const inputToken = tokens.find(token => getTokenSlug(token) === descriptor.slug);

    return isDefined(inputToken) ? { inputToken } : undefined;
  }, [routes, currentRouteName, tokens]);
};

interface ManageAssetsRoute {
  name: ScreensEnum.ManageAssets;
  params: { collectibles: boolean };
}

const isManageAssetsRoute = (route: { name: string; params?: object } | undefined): route is ManageAssetsRoute =>
  route?.name === ScreensEnum.ManageAssets && 'collectibles' in (route.params ?? {});

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
