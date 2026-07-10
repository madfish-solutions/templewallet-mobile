import { Dispatch } from 'redux';
import { isAddress } from 'viem';

import {
  EtherlinkChainId,
  EtherlinkTokenType,
  fetchAllAccountNfts,
  fetchGetAccountInfo,
  fetchGetTokensBalances,
  isErc20TokenBalance
} from 'src/apis/etherlink';
import { processLoadedEvmAssetsAction } from 'src/store/evm/assets/evm-assets-actions';
import { EvmChainAssetsRecord } from 'src/store/evm/assets/evm-assets-state';
import { processLoadedEvmBalancesAction } from 'src/store/evm/balances/evm-balances-actions';
import { processLoadedEvmCollectiblesMetadataAction } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-actions';
import { EvmCollectibleMetadata } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-state';
import { processLoadedEvmExchangeRatesAction } from 'src/store/evm/exchange-rates/evm-exchange-rates-actions';
import { processLoadedEvmTokensMetadataAction } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-actions';
import { EvmTokenMetadata } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-state';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { DEFAULT_EVM_CHAINS_SPECS, EvmNetworkEssentials } from 'src/types/networks';
import { getEvmAssetBalance, getEvmNativeBalance } from 'src/utils/evm/on-chain/balance';
import { getEvmAssetsBalances, EvmAssetToReadBalanceFor } from 'src/utils/evm/on-chain/multicall-balances';
import { EvmContractAssetStandard } from 'src/utils/evm/on-chain/types';
import { normalizeIpfsUri } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';

interface NormalizedEtherlinkAccountData {
  assets: Record<string, { standard: EvmAssetStandardEnum }>;
  balances: Record<string, string>;
  tokensMetadata: Record<string, EvmTokenMetadata>;
  collectiblesMetadata: Record<string, EvmCollectibleMetadata>;
  exchangeRates: Record<string, number>;
}

const isPositiveBalance = (value?: string | null): value is string => value != null && value !== '' && value !== '0';

export const etherlinkTokenTypeToStandard = (type: EtherlinkTokenType): EvmAssetStandardEnum => {
  switch (type) {
    case 'ERC-721':
      return EvmAssetStandardEnum.ERC721;
    case 'ERC-1155':
      return EvmAssetStandardEnum.ERC1155;
    default:
      return EvmAssetStandardEnum.ERC20;
  }
};

const getEtherlinkNativeCurrency = (chainId: EtherlinkChainId) =>
  DEFAULT_EVM_CHAINS_SPECS.find(specs => specs.chainId === chainId)?.currency;

export const getEtherlinkAccountData = async (
  chainId: EtherlinkChainId,
  address: HexString
): Promise<NormalizedEtherlinkAccountData> => {
  const [accountInfo, tokensBalances, nfts] = await Promise.all([
    fetchGetAccountInfo(chainId, address),
    fetchGetTokensBalances(chainId, address),
    fetchAllAccountNfts(chainId, address)
  ]);

  const assets: NormalizedEtherlinkAccountData['assets'] = {};
  const balances: NormalizedEtherlinkAccountData['balances'] = {};
  const tokensMetadata: NormalizedEtherlinkAccountData['tokensMetadata'] = {};
  const collectiblesMetadata: NormalizedEtherlinkAccountData['collectiblesMetadata'] = {};
  const exchangeRates: NormalizedEtherlinkAccountData['exchangeRates'] = {};

  const nativeCurrency = getEtherlinkNativeCurrency(chainId);
  if (nativeCurrency && isPositiveBalance(accountInfo.coin_balance)) {
    assets[EVM_TOKEN_SLUG] = { standard: EvmAssetStandardEnum.NATIVE };
    balances[EVM_TOKEN_SLUG] = accountInfo.coin_balance;
    tokensMetadata[EVM_TOKEN_SLUG] = {
      name: nativeCurrency.name,
      symbol: nativeCurrency.symbol,
      decimals: nativeCurrency.decimals,
      iconUri: nativeCurrency.iconURL,
      standard: EvmAssetStandardEnum.NATIVE
    };
  }

  if (accountInfo.exchange_rate != null) {
    exchangeRates[EVM_TOKEN_SLUG] = Number(accountInfo.exchange_rate);
  }

  for (const tokenBalance of tokensBalances) {
    if (!isErc20TokenBalance(tokenBalance)) {
      continue;
    }

    const { token, value } = tokenBalance;
    const slug = token.address_hash.toLowerCase();

    if (token.decimals != null) {
      tokensMetadata[slug] = {
        name: token.name ?? undefined,
        symbol: token.symbol ?? undefined,
        decimals: Number(token.decimals),
        iconUri: token.icon_url ?? undefined,
        standard: EvmAssetStandardEnum.ERC20
      };
    }

    if (token.exchange_rate != null) {
      exchangeRates[slug] = Number(token.exchange_rate);
    }

    if (!isPositiveBalance(value)) {
      continue;
    }

    assets[slug] = { standard: EvmAssetStandardEnum.ERC20 };
    balances[slug] = value;
  }

  for (const nft of nfts) {
    if (!isPositiveBalance(nft.value)) {
      continue;
    }

    const { token, metadata, image_url, id, value } = nft;
    const contract = token.address_hash.toLowerCase();
    const slug = `${contract}_${id}`;
    const standard = etherlinkTokenTypeToStandard(token.type);

    assets[slug] = { standard };
    balances[slug] = value;
    collectiblesMetadata[slug] = {
      tokenId: id,
      name: metadata?.name ?? undefined,
      symbol: token.symbol ?? undefined,
      // The normalized ipfs:// form rides the tcinfra media proxy (proven at Tezos-collectibles scale);
      // image_url is a dweb.link gateway link that rate-limits under grid-burst load
      iconUri: normalizeIpfsUri(metadata?.image) ?? image_url ?? undefined,
      collectionName: token.name ?? undefined,
      standard
    };
  }

  return { assets, balances, tokensMetadata, collectiblesMetadata, exchangeRates };
};

interface DispatchEtherlinkAccountDataParams {
  dispatch: Dispatch;
  account: HexString;
  chainId: EtherlinkChainId;
  data: NormalizedEtherlinkAccountData;
  nativeUsdRate?: number;
  timestamp?: number;
  preservedSlugs?: string[];
}

export const dispatchEtherlinkAccountData = ({
  dispatch,
  account,
  chainId,
  data,
  nativeUsdRate,
  timestamp = Date.now(),
  preservedSlugs
}: DispatchEtherlinkAccountDataParams) => {
  const rates =
    nativeUsdRate != null && data.exchangeRates[EVM_TOKEN_SLUG] == null
      ? { ...data.exchangeRates, [EVM_TOKEN_SLUG]: nativeUsdRate }
      : data.exchangeRates;

  dispatch(processLoadedEvmAssetsAction({ account, chainId, assets: data.assets }));
  dispatch(processLoadedEvmBalancesAction({ account, chainId, balances: data.balances, timestamp, preservedSlugs }));
  dispatch(processLoadedEvmTokensMetadataAction({ chainId, metadata: data.tokensMetadata }));
  dispatch(processLoadedEvmCollectiblesMetadataAction({ chainId, metadata: data.collectiblesMetadata }));
  dispatch(processLoadedEvmExchangeRatesAction({ chainId, rates }));
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

    const [contract, tokenId] = slug.split('_');
    if (!isAddress(contract)) {
      continue;
    }

    list.push({ slug, standard, contract, tokenId });
  }

  return list;
};

interface LoadEtherlinkBalancesOnChainParams {
  dispatch: Dispatch;
  network: EvmNetworkEssentials;
  account: HexString;
  chainId: EtherlinkChainId;
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
    if (isPositiveBalance(contractBalances[slug])) {
      balances[slug] = contractBalances[slug];
    }
  }

  for (const { slug, standard, contract, tokenId } of assetsToRead) {
    if (!failed.includes(slug)) {
      continue;
    }

    const balance = await getEvmAssetBalance(network, account, contract, tokenId, standard);

    if (isDefined(balance)) {
      if (isPositiveBalance(balance)) {
        balances[slug] = balance;
      }
    } else {
      stillFailed.push(slug);
    }
  }

  return { balances, failed: stillFailed };
};

export const loadEtherlinkBalancesOnChain = async ({
  dispatch,
  network,
  account,
  chainId,
  knownAssets
}: LoadEtherlinkBalancesOnChainParams) => {
  const [{ balances }, nativeBalance] = await Promise.all([
    readContractAssetsBalancesOnChain(network, account, knownAssets),
    getEvmNativeBalance(network, account)
  ]);

  if (isPositiveBalance(nativeBalance)) {
    balances[EVM_TOKEN_SLUG] = nativeBalance;
  }

  dispatch(processLoadedEvmBalancesAction({ account, chainId, balances, timestamp: Date.now() }));
};
