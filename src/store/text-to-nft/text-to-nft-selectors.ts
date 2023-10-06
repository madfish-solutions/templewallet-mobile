import { useSelector } from '../selector';

export const useIsHistoryBackButtonAlertShowedOnceSelector = () =>
  useSelector(({ textToNft }) => textToNft.isHistoryBackButtonAlertShowedOnce);
