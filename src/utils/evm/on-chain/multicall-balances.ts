import { erc20Abi, erc721Abi } from 'viem';

import { EvmNetworkEssentials } from 'src/types/networks';
import { getViemPublicClient } from 'src/utils/rpc/evm-client.utils';

import { erc1155Abi } from './abi/erc1155.abi';
import { equalsIgnoreCase } from './common.utils';
import { acquireEvmRpsSlot } from './evm-rpc-requests-executor';
import { EvmAssetStandard, EvmContractAssetStandard } from './types';

export interface EvmAssetToReadBalanceFor {
  slug: string;
  standard: EvmContractAssetStandard;
  contract: HexString;
  /** Required for ERC-721/ERC-1155, ignored for ERC-20 */
  tokenId?: string;
}

interface EvmAssetsBalancesResult {
  /** Every viem `bigint`/owner-address result is converted to a decimal string before it leaves this module */
  balances: Record<string, string>;
  failed: string[];
}

const MULTICALL_TIMEOUT_MS = 30_000;

export const getEvmAssetsBalances = async (
  network: EvmNetworkEssentials,
  account: HexString,
  assets: EvmAssetToReadBalanceFor[]
): Promise<EvmAssetsBalancesResult> => {
  if (assets.length === 0) {
    return { balances: {}, failed: [] };
  }

  const publicClient = getViemPublicClient(network);

  const contracts = assets.map(({ standard, contract, tokenId }) => {
    switch (standard) {
      case EvmAssetStandard.ERC20:
        return {
          address: contract,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [account]
        } as const;
      case EvmAssetStandard.ERC721:
        return {
          address: contract,
          abi: erc721Abi,
          functionName: 'ownerOf',
          args: [BigInt(tokenId ?? '0')]
        } as const;
      case EvmAssetStandard.ERC1155:
        return {
          address: contract,
          abi: erc1155Abi,
          functionName: 'balanceOf',
          args: [account, BigInt(tokenId ?? '0')]
        } as const;
    }
  });

  const executeMulticall = () => publicClient.multicall({ allowFailure: true, contracts });

  // Count this batch against the per-chain RPS limit
  await acquireEvmRpsSlot(network);

  let responses: Awaited<ReturnType<typeof executeMulticall>>;
  try {
    responses = await Promise.race([
      executeMulticall(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Multicall request timed out')), MULTICALL_TIMEOUT_MS);
      })
    ]);
  } catch {
    return { balances: {}, failed: assets.map(({ slug }) => slug) };
  }

  const balances: Record<string, string> = {};
  const failed: string[] = [];

  responses.forEach((response, index) => {
    const { slug, standard } = assets[index];

    if (response.status !== 'success') {
      failed.push(slug);

      return;
    }

    const parsedBalance = parseBalanceResult(standard, response.result, account);
    if (parsedBalance === undefined) {
      failed.push(slug);

      return;
    }

    balances[slug] = parsedBalance;
  });

  return { balances, failed };
};

const parseBalanceResult = (
  standard: EvmContractAssetStandard,
  result: unknown,
  account: HexString
): string | undefined => {
  switch (standard) {
    case EvmAssetStandard.ERC20:
    case EvmAssetStandard.ERC1155:
      return typeof result === 'bigint' ? result.toString() : undefined;
    case EvmAssetStandard.ERC721:
      return typeof result === 'string' ? (equalsIgnoreCase(result, account) ? '1' : '0') : undefined;
  }
};
