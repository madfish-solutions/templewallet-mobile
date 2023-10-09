import { useSelector } from '../selector';

export const useAccessTokenSelector = () => useSelector(({ textToNft }) => textToNft.accessToken);

export const useTextToNftOrdersSelector = () => useSelector(({ textToNft }) => textToNft.orders.data);

export const useIsHistoryBackButtonAlertShowedOnceSelector = () =>
  useSelector(({ textToNft }) => textToNft.isHistoryBackButtonAlertShowedOnce);
