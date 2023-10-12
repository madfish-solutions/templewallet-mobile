import { useEffect, useState } from 'react';

import { getStableDiffusionUserQuota } from 'src/apis/stable-diffusion';
import { useAccessTokenSelector } from 'src/store/text-to-nft/text-to-nft-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { isDefined } from 'src/utils/is-defined';

export const useUserGenerationQuota = () => {
  const [quota, setQuota] = useState(0);
  const { publicKeyHash } = useSelectedAccountSelector();
  const accessToken = useAccessTokenSelector(publicKeyHash);

  useEffect(() => {
    if (isDefined(accessToken)) {
      getStableDiffusionUserQuota(accessToken)
        .then(({ data }) => setQuota(data))
        .catch(() => null);
    } else {
      setQuota(100);
    }
  }, [accessToken]);

  return quota;
};
