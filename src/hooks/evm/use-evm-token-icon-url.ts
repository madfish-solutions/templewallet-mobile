import useSWR from 'swr';
import { isAddress } from 'viem';

import { fetchGetTokenInfo } from 'src/apis/etherlink';
import { EvmTokenImagesStackParams } from 'src/hooks/use-images-stack';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

const fetchTokenIconUrl = async ([, address]: [string, string]): Promise<string | null> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const token = await fetchGetTokenInfo(address, controller.signal);

    return token.icon_url?.trim() || null;
  } finally {
    clearTimeout(timeout);
  }
};

export const useEvmTokenIconUrl = ({
  address,
  chainId,
  iconURL,
  isCollectible
}: EvmTokenImagesStackParams): string | undefined => {
  const providedIconURL = iconURL?.trim();
  const needsExplorerIcon =
    chainId === ETHERLINK_MAINNET_CHAIN_ID && !isCollectible && !providedIconURL && isAddress(address);
  const { data } = useSWR(
    needsExplorerIcon ? ['etherlink-token-icon', address.toLowerCase()] : null,
    fetchTokenIconUrl,
    {
      dedupingInterval: 60_000,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false
    }
  );

  return providedIconURL || data || undefined;
};
