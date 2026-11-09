import { erc20Abi } from 'viem';

import { dispatch, store } from 'src/store';
import { mergeEvmAssetsAction } from 'src/store/evm/assets/evm-assets-actions';
import { processLoadedOnChainEvmBalances } from 'src/store/evm/balances/evm-balances-actions';
import { processLoadedEvmTokensMetadataAction } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-actions';
import { EvmStoredTokenMetadata } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-state';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { EvmSwapAsset } from 'src/types/evm-swap';
import { ETHERLINK_MAINNET_CHAIN_SPECS, EvmNetworkEssentials } from 'src/types/networks';
import { getAccountAddressForEvm } from 'src/utils/account.utils';
import { filterManualAssetMetadata } from 'src/utils/evm/filter-manual-asset-metadata';
import { getViemPublicClient } from 'src/utils/rpc/evm-client.utils';

export const refreshSwapBalances = async (
  network: EvmNetworkEssentials,
  accountId: string,
  account: HexString,
  input: EvmSwapAsset,
  output: EvmSwapAsset
): Promise<void> => {
  const client = getViemPublicClient(network);
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const tokens = [input, output].filter(asset => asset.standard === EvmAssetStandardEnum.ERC20);
      const [nativeBalance, ...tokenBalances] = await Promise.all([
        client.getBalance({ address: account }),
        ...tokens.map(asset =>
          client.readContract({
            abi: erc20Abi,
            address: asset.contractAddress,
            functionName: 'balanceOf',
            args: [account]
          })
        )
      ]);
      const exists = store
        .getState()
        .wallet.accounts.some(
          item => item.id === accountId && getAccountAddressForEvm(item)?.toLowerCase() === account.toLowerCase()
        );
      if (!exists) return;
      const balances: Record<string, string> = { [EVM_TOKEN_SLUG]: nativeBalance.toString() };
      const metadata: Record<string, EvmStoredTokenMetadata> = {
        [EVM_TOKEN_SLUG]: ETHERLINK_MAINNET_CHAIN_SPECS.currency
      };
      for (const [index, token] of tokens.entries()) {
        balances[token.assetSlug] = tokenBalances[index].toString();
        metadata[token.assetSlug] = {
          address: token.contractAddress,
          standard: EvmAssetStandardEnum.ERC20,
          decimals: token.decimals,
          name: token.name,
          symbol: token.symbol,
          iconURL: token.thumbnailUri
        };
      }
      if (BigInt(balances[output.assetSlug]) === 0n) throw new Error('The destination balance is not available yet.');
      dispatch(
        mergeEvmAssetsAction({
          account,
          chainId: network.chainId,
          assets: {
            [EVM_TOKEN_SLUG]: { standard: EvmAssetStandardEnum.NATIVE },
            [input.assetSlug]: { standard: input.standard },
            [output.assetSlug]: { standard: output.standard }
          }
        })
      );
      dispatch(
        processLoadedEvmTokensMetadataAction({
          chainId: network.chainId,
          metadata: filterManualAssetMetadata(metadata, store.getState().evmAssets.record, network.chainId)
        })
      );
      dispatch(processLoadedOnChainEvmBalances({ account, chainId: network.chainId, balances, timestamp: Date.now() }));

      return;
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  throw lastError;
};
