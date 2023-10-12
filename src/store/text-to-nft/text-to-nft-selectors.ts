import { isDefined } from 'src/utils/is-defined';

import { useSelector } from '../selector';

export const useAccessTokenSelector = (account: string) =>
  useSelector(({ textToNft }) =>
    isDefined(textToNft.accountsStateRecord[account])
      ? textToNft.accountsStateRecord[account].accessToken ?? null
      : null
  );

export const useTextToNftOrdersSelector = (account: string) =>
  useSelector(({ textToNft }) =>
    isDefined(textToNft.accountsStateRecord[account]) ? textToNft.accountsStateRecord[account].orders.data : []
  );

export const useIsHistoryBackButtonAlertShowedOnceSelector = () =>
  useSelector(({ textToNft }) => textToNft.isHistoryBackButtonAlertShowedOnce);
