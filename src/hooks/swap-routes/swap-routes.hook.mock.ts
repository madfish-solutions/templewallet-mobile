export const useSwapRoutesMock = jest.fn();

jest.mock('./swap-routes.hook', () => ({ useSwapRoutes: useSwapRoutesMock }));
