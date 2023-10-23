import { useState } from 'react';

import { getStableDiffusionOrderById, handleStableDiffusionError } from 'src/apis/stable-diffusion';
import { OrderStatus, StableDiffusionOrder } from 'src/apis/stable-diffusion/types';
import { useAccessTokenSelector } from 'src/store/text-to-nft/text-to-nft-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToast } from 'src/toast/toast.utils';
import { useInterval } from 'src/utils/hooks';
import { isDefined } from 'src/utils/is-defined';

const DEFAULT_ERROR_MESSAGE = 'Ooops, something went wrong';
const ORDER_REFRESH_INTERVAL = 10000;

export const useOrderPreview = (id: string) => {
  const { publicKeyHash } = useSelectedAccountSelector();

  const initialOrder = {
    id,
    createdAt: '',
    accountPkh: publicKeyHash,
    positivePrompt: '',
    negativePrompt: '',
    status: OrderStatus.Pending,
    variants: null,
    width: 0,
    height: 0,
    panorama: 'no' as const
  };

  const [order, setOrder] = useState<StableDiffusionOrder>(initialOrder);

  const accessToken = useAccessTokenSelector(publicKeyHash);

  useInterval(
    () => {
      if (isDefined(accessToken)) {
        getStableDiffusionOrderById(accessToken, id)
          .then(({ data }) => setOrder(data))
          .catch(handleStableDiffusionError);
      } else {
        showErrorToast({ description: DEFAULT_ERROR_MESSAGE });
      }
    },
    ORDER_REFRESH_INTERVAL,
    [accessToken]
  );

  return order;
};
