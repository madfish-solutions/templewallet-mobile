import { isAddress } from 'viem';

import {
  EtherlinkTokenType,
  fetchAllAccountNfts,
  fetchGetAccountInfo,
  fetchGetTokensBalances,
  isErc20TokenBalance,
  isEtherlinkCollectibleTokenType
} from 'src/apis/etherlink';
import { dispatch } from 'src/store';
import { processLoadedEvmAssetsAction } from 'src/store/evm/assets/evm-assets-actions';
import { EvmChainAssetsRecord } from 'src/store/evm/assets/evm-assets-state';
import {
  processLoadedEvmBalancesAction,
  processLoadedOnChainEvmBalancesAction
} from 'src/store/evm/balances/evm-balances-actions';
import { processLoadedEvmCollectiblesMetadataAction } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-actions';
import { buildEvmCollectibleMetadataFromApi } from 'src/store/evm/collectibles-metadata/utils';
import { processLoadedEvmExchangeRatesAction } from 'src/store/evm/exchange-rates/evm-exchange-rates-actions';
import { processLoadedEvmTokensMetadataAction } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-actions';
import { EvmStoredTokenMetadata } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-state';
import { buildEvmTokenMetadataFromApi } from 'src/store/evm/tokens-metadata/utils';
import {
  EvmAssetStandardEnum,
  EvmCollectibleMetadata,
  EVM_TOKEN_SLUG
} from 'src/token/interfaces/token-metadata.interface';
import { ETHERLINK_MAINNET_CHAIN_SPECS, EvmNetworkEssentials } from 'src/types/networks';
import { getEvmAssetBalance, getEvmNativeBalance } from 'src/utils/evm/on-chain/balance';
import { getEvmAssetsBalances, EvmAssetToReadBalanceFor } from 'src/utils/evm/on-chain/multicall-balances';
import { EvmContractAssetStandard } from 'src/utils/evm/on-chain/types';
import { fetchTezExchangeRate } from 'src/utils/exchange-rate.util';
import { fromTokenSlug } from 'src/utils/from-token-slug';
import { isDefined } from 'src/utils/is-defined';
import { isPositiveNumber } from 'src/utils/number.util';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

interface NormalizedEtherlinkAccountData {
  assets: Record<string, { standard: EvmAssetStandardEnum }>;
  balances: Record<string, string>;
  tokensMetadata: Record<string, EvmStoredTokenMetadata>;
  collectiblesMetadata: Record<string, EvmCollectibleMetadata>;
  exchangeRates: Record<string, number>;
}

const ETHERLINK_TYPE_TO_STANDARD = {
  'ERC-20': EvmAssetStandardEnum.ERC20,
  'ERC-721': EvmAssetStandardEnum.ERC721,
  'ERC-1155': EvmAssetStandardEnum.ERC1155
} as const;

const etherlinkTokenTypeToStandard = <T extends EtherlinkTokenType>(type: T) => ETHERLINK_TYPE_TO_STANDARD[type];

const etherlinkNativeCurrency = ETHERLINK_MAINNET_CHAIN_SPECS.currency;

export const getEtherlinkAccountData = async (address: HexString): Promise<NormalizedEtherlinkAccountData> => {
  const [accountInfo, tokensBalances, nfts, nativeUsdRate] = await Promise.all([
    fetchGetAccountInfo(address),
    fetchGetTokensBalances(address),
    fetchAllAccountNfts(address),
    fetchTezExchangeRate().catch(() => null)
  ]);

  const assets: NormalizedEtherlinkAccountData['assets'] = {};
  const balances: NormalizedEtherlinkAccountData['balances'] = {};
  const tokensMetadata: NormalizedEtherlinkAccountData['tokensMetadata'] = {};
  const collectiblesMetadata: NormalizedEtherlinkAccountData['collectiblesMetadata'] = {};
  const exchangeRates: NormalizedEtherlinkAccountData['exchangeRates'] = {};

  const coinBalance = accountInfo.coin_balance ?? undefined;
  if (isPositiveNumber(coinBalance)) {
    assets[EVM_TOKEN_SLUG] = { standard: EvmAssetStandardEnum.NATIVE };
    balances[EVM_TOKEN_SLUG] = coinBalance;
    tokensMetadata[EVM_TOKEN_SLUG] = etherlinkNativeCurrency;
  }

  if (nativeUsdRate != null) {
    exchangeRates[EVM_TOKEN_SLUG] = nativeUsdRate;
  }

  for (const tokenBalance of tokensBalances) {
    if (!isErc20TokenBalance(tokenBalance)) {
      continue;
    }

    const { token, value } = tokenBalance;
    const slug = token.address_hash.toLowerCase();

    if (token.decimals != null) {
      tokensMetadata[slug] = buildEvmTokenMetadataFromApi(token, Number(token.decimals));
    }

    if (token.exchange_rate != null) {
      exchangeRates[slug] = Number(token.exchange_rate);
    }

    if (!isPositiveNumber(value)) {
      continue;
    }

    assets[slug] = { standard: EvmAssetStandardEnum.ERC20 };
    balances[slug] = value;
  }

  for (const nft of nfts) {
    if (!isPositiveNumber(nft.value)) {
      continue;
    }

    const { token, id, value } = nft;
    if (!isEtherlinkCollectibleTokenType(token.type)) {
      continue;
    }

    const contract = token.address_hash.toLowerCase();
    const slug = `${contract}_${id}`;
    const standard = etherlinkTokenTypeToStandard(token.type);

    assets[slug] = { standard };
    balances[slug] = value;
    collectiblesMetadata[slug] = buildEvmCollectibleMetadataFromApi(nft, standard);
  }

  return { assets, balances, tokensMetadata, collectiblesMetadata, exchangeRates };
};

interface DispatchEtherlinkAccountDataParams {
  account: HexString;
  data: NormalizedEtherlinkAccountData;
  timestamp?: number;
  preservedSlugs?: string[];
}

export const dispatchEtherlinkAccountData = ({
  account,
  data,
  timestamp = Date.now(),
  preservedSlugs
}: DispatchEtherlinkAccountDataParams) => {
  const chainId = ETHERLINK_MAINNET_CHAIN_ID;

  dispatch(processLoadedEvmAssetsAction({ account, chainId, assets: data.assets }));
  dispatch(processLoadedEvmBalancesAction({ account, chainId, balances: data.balances, timestamp, preservedSlugs }));
  dispatch(processLoadedEvmTokensMetadataAction({ chainId, metadata: data.tokensMetadata }));
  dispatch(processLoadedEvmCollectiblesMetadataAction({ chainId, metadata: data.collectiblesMetadata }));
  dispatch(processLoadedEvmExchangeRatesAction({ chainId, rates: data.exchangeRates }));
};

const isContractStandard = (standard: EvmAssetStandardEnum): standard is EvmContractAssetStandard =>
  standard === EvmAssetStandardEnum.ERC20 ||
  standard === EvmAssetStandardEnum.ERC721 ||
  standard === EvmAssetStandardEnum.ERC1155;

const knownAssetsToReadList = (knownAssets: EvmChainAssetsRecord): EvmAssetToReadBalanceFor[] => {
  const list: EvmAssetToReadBalanceFor[] = [];

  for (const slug in knownAssets) {
    const { standard } = knownAssets[slug];
    if (!isContractStandard(standard)) {
      continue;
    }

    const [contract, tokenId] = fromTokenSlug(slug);
    if (!isAddress(contract)) {
      continue;
    }

    list.push({ slug, standard, contract, tokenId });
  }

  return list;
};

interface LoadEtherlinkBalancesOnChainParams {
  network: EvmNetworkEssentials;
  account: HexString;
  knownAssets: EvmChainAssetsRecord;
}

/** Positive balances only; `failed` lists slugs whose reads did not succeed (multicall + sequential retry) */
export const readContractAssetsBalancesOnChain = async (
  network: EvmNetworkEssentials,
  account: HexString,
  knownAssets: EvmChainAssetsRecord
): Promise<{ balances: Record<string, string>; failed: string[] }> => {
  const assetsToRead = knownAssetsToReadList(knownAssets);
  const { balances: contractBalances, failed } = await getEvmAssetsBalances(network, account, assetsToRead);

  const balances: Record<string, string> = {};
  const stillFailed: string[] = [];

  for (const slug in contractBalances) {
    if (isPositiveNumber(contractBalances[slug])) {
      balances[slug] = contractBalances[slug];
    }
  }

  const failedSet = new Set(failed);
  await Promise.all(
    assetsToRead
      .filter(({ slug }) => failedSet.has(slug))
      .map(async ({ slug, standard, contract, tokenId }) => {
        const balance = await getEvmAssetBalance(network, account, contract, tokenId, standard);

        if (isDefined(balance)) {
          if (isPositiveNumber(balance)) {
            balances[slug] = balance;
          }
        } else {
          stillFailed.push(slug);
        }
      })
  );

  return { balances, failed: stillFailed };
};

export const loadEtherlinkBalancesOnChain = async ({
  network,
  account,
  knownAssets
}: LoadEtherlinkBalancesOnChainParams) => {
  const [{ balances }, nativeBalance] = await Promise.all([
    readContractAssetsBalancesOnChain(network, account, knownAssets),
    getEvmNativeBalance(network, account)
  ]);

  if (isPositiveNumber(nativeBalance)) {
    balances[EVM_TOKEN_SLUG] = nativeBalance;
  }

  dispatch(
    processLoadedOnChainEvmBalancesAction({
      account,
      chainId: ETHERLINK_MAINNET_CHAIN_ID,
      balances,
      timestamp: Date.now()
    })
  );
};
